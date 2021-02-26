/* eslint-disable no-unused-vars */
import D from 'i18n';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useAPI } from 'utils/hook';
import { useState } from 'react';

const getPercent = (n, length) => Math.round((100 * n) / length);

const usePutResourcesInCache = setResourceProgress => {
  const { getRequiredNomenclatures, getNomenclature } = useAPI();

  const putResourcesInCache = async campaignId => {
    const resourcesResponse = await getRequiredNomenclatures(campaignId);
    let i = 0;
    setResourceProgress(0);
    const resources = await resourcesResponse.data;
    await resources.reduce(async (previousPromise, resourceId) => {
      await previousPromise;
      i += 1;
      setResourceProgress(getPercent(i, resources.length));
      return getNomenclature(resourceId);
    }, Promise.resolve());
    setResourceProgress(100);
  };

  return { putResourcesInCache };
};

const usePutSUInDataBase = () => {
  const { getData, getComment } = useAPI();
  const putSurveyUnit = async id => {
    const dR = await getData(id);
    const cR = await getComment(id);
    if (!dR.error && !cR.error) {
      await surveyUnitIdbService.addOrUpdateSU({
        id,
        ...dR.data,
        comment: cR.data,
      });
    }
    Promise.reject();
  };
  return { putSurveyUnit };
};
const usePutSUsInDataBaseByCampaignId = setSurveyUnitProgress => {
  const { getSurveyUnits } = useAPI();
  const { putSurveyUnit } = usePutSUInDataBase();

  const putSUS = async campaignId => {
    const { data: surveyUnits, error } = await getSurveyUnits(campaignId);
    let i = 0;
    if (!error) {
      await surveyUnits.reduce(async (previousPromise, { id }) => {
        await previousPromise;
        i += 1;
        setSurveyUnitProgress(getPercent(i, surveyUnits.length));
        return putSurveyUnit(id);
      }, Promise.resolve());
      setSurveyUnitProgress(100);
    } else {
      Promise.reject();
    }
  };

  return { putSUS };
};

const useSendData = setSendingProgress => {
  const { putData, putComment } = useAPI();

  const send = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    let i = 0;
    setSendingProgress(0);
    await surveyUnits.reduce(async (previousPromise, surveyUnit) => {
      await previousPromise;
      const { id, comment, ...other } = surveyUnit;
      const sendSurveyUnit = async () => {
        const { error: putDataError } = await putData(id, other);
        const { error: putCommentError } = await putComment(id, comment);
        if (putDataError || putCommentError) Promise.reject();
        i += 1;
        setSendingProgress(getPercent(i, surveyUnits.length));
      };
      return sendSurveyUnit();
    }, Promise.resolve());
  };

  return { send };
};

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

export const useSynchronisation = () => {
  const { getCampaigns, getQuestionnaire } = useAPI();

  const [waitingMessage, setWaitingMessage] = useState(null);
  const [sendingProgress, setSendingProgress] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(null);
  const [resourceProgress, setResourceProgress] = useState(0);
  const [surveyUnitProgress, setSurveyUnitProgress] = useState(0);
  const [current, setCurrent] = useState(null);

  const { send: sendData } = useSendData(setSendingProgress);
  const { putResourcesInCache } = usePutResourcesInCache(setResourceProgress);
  const { putSUS: putSurveyUnitsInDataBaseByCampaignId } = usePutSUsInDataBaseByCampaignId(
    setSurveyUnitProgress
  );

  const synchronize = async () => {
    setWaitingMessage(D.waitingConfiguration);
    // (0) : get configuration

    setWaitingMessage(D.waitingSendingData);
    setCurrent('send');
    // (2) : send the local data to server
    await sendData();

    setSendingProgress(null);

    // (3) : clean
    setWaitingMessage(D.waitingCleaning);
    await clean();

    // (4) : Get the data
    setWaitingMessage(D.waintingData);
    const campaignsResponse = await getCampaigns();
    const campaigns = await campaignsResponse.data;
    let i = 0;
    setCampaignProgress(0);

    await campaigns.reduce(async (previousPromise, { id }) => {
      await previousPromise;
      const getAllCampaign = async () => {
        setResourceProgress(0);
        setSurveyUnitProgress(0);
        setCurrent('questionnaire');
        await getQuestionnaire(id);
        setCurrent('resources');
        await putResourcesInCache(id);
        setCurrent('survey-units');
        await putSurveyUnitsInDataBaseByCampaignId(id);
        setCurrent(null);
        i += 1;
        setCampaignProgress(getPercent(i, campaigns.length));
      };
      return getAllCampaign();
    }, Promise.resolve());
  };

  return {
    synchronize,
    current,
    waitingMessage,
    sendingProgress,
    campaignProgress,
    resourceProgress,
    surveyUnitProgress,
  };
};
