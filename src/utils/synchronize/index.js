import * as api from 'utils/api';
import D from 'i18n';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { QUEEN_URL } from 'utils/constants';
import { kc } from 'utils/keycloak';
import { useState } from 'react';

const getConfiguration = async () => {
  const response = await fetch(`${QUEEN_URL}/configuration.json`);
  const configuration = await response.json();
  return configuration;
};

const getPercent = (n, length) => Math.round((100 * n) / length);

const putQuestionnaireInCache = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id) => {
  await api.getQuestionnaireById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id);
};

const putResourcesInCache = (
  QUEEN_API_URL,
  QUEEN_AUTHENTICATION_MODE,
  campaignId
) => async setResourceProgress => {
  const resourcesResponse = await api.getListRequiredNomenclature(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(campaignId);
  let i = 0;
  setResourceProgress(0);
  const resources = await resourcesResponse.data;
  await resources.reduce(async (previousPromise, resourceId) => {
    await previousPromise;
    i += 1;
    setResourceProgress(getPercent(i, resources.length));
    return api.getNomenclatureById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(resourceId);
  }, Promise.resolve());
  setResourceProgress(100);
};

const putSurveyUnitInDataBase = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id) => {
  const dataResponse = await api.getDataSurveyUnitById(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(id);
  const surveyUnitData = await dataResponse.data;
  const commentResponse = await api.getCommentSurveyUnitById(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(id);
  const surveyUnitComment = await commentResponse.data;
  await surveyUnitIdbService.addOrUpdateSU({
    id,
    data: surveyUnitData,
    comment: surveyUnitComment,
  });
};

const putSurveyUnitsInDataBaseByCampaignId = (
  QUEEN_API_URL,
  QUEEN_AUTHENTICATION_MODE,
  campaignId
) => async setSurveyUnitProgress => {
  const surveyUnitsResponse = await api.getSurveyUnitByIdCampaign(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(campaignId);
  const surveyUnits = await surveyUnitsResponse.data;
  let i = 0;
  setSurveyUnitProgress(0);

  await surveyUnits.reduce(async (previousPromise, { id }) => {
    await previousPromise;
    i += 1;
    setSurveyUnitProgress(getPercent(i, surveyUnits.length));
    return putSurveyUnitInDataBase(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
  }, Promise.resolve());
  setSurveyUnitProgress(100);
};

const sendData = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => async setSendingProgress => {
  const surveyUnits = await surveyUnitIdbService.getAll();
  let i = 0;
  setSendingProgress(0);
  await surveyUnits.reduce(async (previousPromise, surveyUnit) => {
    await previousPromise;
    const { id, data, comment } = surveyUnit;
    const sendSurveyUnit = async () => {
      await api.putDataSurveyUnitById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id, data);
      await api.putCommentSurveyUnitById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id, comment);
      i += 1;
      setSendingProgress(getPercent(i, surveyUnits.length));
    };
    return sendSurveyUnit();
  }, Promise.resolve());
};

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

const authentication = () =>
  new Promise((resolve, reject) => {
    if (navigator.onLine) {
      kc.init()
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(e => reject(e));
    } else {
      resolve();
    }
  });

export const useSynchronisation = () => {
  const [waitingMessage, setWaitingMessage] = useState(null);
  const [sendingProgress, setSendingProgress] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(null);
  const [resourceProgress, setResourceProgress] = useState(null);
  const [surveyUnitProgress, setSurveyUnitProgress] = useState(null);

  const synchronize = async () => {
    setWaitingMessage(D.waitingConfiguration);
    // (0) : get configuration
    const { QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE } = await getConfiguration();

    // (1) : authentication
    setWaitingMessage(D.waitingAuthentication);
    if (QUEEN_AUTHENTICATION_MODE === 'keycloak') {
      await authentication();
    }

    setWaitingMessage(D.waitingSendingData);
    // (2) : send the local data to server
    await sendData(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(setSendingProgress);

    setSendingProgress(null);

    // (3) : clean
    setWaitingMessage(D.waitingCleaning);
    await clean();

    // (4) : Get the data
    setWaitingMessage(D.waitingLoadingCampaigns);
    const campaignsResponse = await api.getCampaigns(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE);
    const campaigns = await campaignsResponse.data;
    let i = 0;
    setCampaignProgress(0);

    await campaigns.reduce(async (previousPromise, { id }) => {
      await previousPromise;
      const getAllCampaign = async () => {
        setWaitingMessage(D.waitingLoadingQuestionnaire);
        await putQuestionnaireInCache(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
        setWaitingMessage(D.waitingLoadingResources);
        await putResourcesInCache(
          QUEEN_API_URL,
          QUEEN_AUTHENTICATION_MODE,
          id
        )(setResourceProgress);
        setResourceProgress(null);
        setWaitingMessage(D.waitingLoadingSU);
        await putSurveyUnitsInDataBaseByCampaignId(
          QUEEN_API_URL,
          QUEEN_AUTHENTICATION_MODE,
          id
        )(setSurveyUnitProgress);
        i += 1;
        setCampaignProgress(getPercent(i, campaigns.length));
        setSurveyUnitProgress(null);
      };
      return getAllCampaign();
    }, Promise.resolve());
  };

  return {
    synchronize,
    waitingMessage,
    sendingProgress,
    campaignProgress,
    resourceProgress,
    surveyUnitProgress,
  };
};
