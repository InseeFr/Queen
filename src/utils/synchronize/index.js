import D from 'i18n';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useState } from 'react';
import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';
import {
  usePutResourcesInCache,
  useSaveSUsToLocalDataBase,
  useSendSurveyUnits,
} from 'utils/hook/synchronize';
import { usePutQuestionnairesInCache } from 'utils/hook/synchronize/questionnaires';

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

const simpleMerge = (list1 = [], list2 = []) =>
  list1.reduce((_, curr) => {
    if (!_.includes(curr)) return [..._, curr];
    return _;
  }, list2);

const innerJoinList = (list1 = [], list2 = []) =>
  simpleMerge(list1, list2).filter(el => list1.includes(el) && list2.includes(el));

export const useSynchronisation = () => {
  const { getCampaigns } = useAPI();

  const refrehGetCampaigns = useAsyncValue(getCampaigns);

  const [waitingMessage, setWaitingMessage] = useState(null);
  const [sendingProgress, setSendingProgress] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(null);
  const [resourceProgress, setResourceProgress] = useState(0);
  const [surveyUnitProgress, setSurveyUnitProgress] = useState(0);
  const [current, setCurrent] = useState(null);

  const sendData = useSendSurveyUnits(setSendingProgress);
  const putQuestionnairesInCache = usePutQuestionnairesInCache();
  const putAllResourcesInCache = usePutResourcesInCache(setResourceProgress);
  const saveSurveyUnitsToLocalDataBase = useSaveSUsToLocalDataBase(setSurveyUnitProgress);

  const getAllCampaign = async campaign => {
    const { id, questionnaireIds } = campaign;
    setResourceProgress(0);
    setSurveyUnitProgress(0);
    setCurrent('questionnaire');
    const questionnaireIdsSuccessQ = await putQuestionnairesInCache(questionnaireIds);
    setCurrent('resources');
    const questionnaireIdsSuccessR = await putAllResourcesInCache(questionnaireIds);
    setCurrent('survey-units');
    await saveSurveyUnitsToLocalDataBase(id);
    setCurrent(null);
    return {
      questionnaireIdsSuccess: innerJoinList(questionnaireIdsSuccessQ, questionnaireIdsSuccessR),
    };
  };

  const synchronize = async () => {
    // (2) : send the local data to server
    setWaitingMessage(D.waitingSendingData);
    setCurrent('send');
    const surveyUnitsInTempZone = await sendData();

    setSendingProgress(null);

    // (3) : clean
    setCurrent('clean');
    setWaitingMessage(D.waitingCleaning);
    await clean();

    // (4) : Get the data
    setWaitingMessage(D.waintingData);
    const { data: campaigns, status, error, statusText } = await refrehGetCampaigns.current();
    let i = 0;
    setCampaignProgress(0);

    var questionnairesAccessible = [];
    if (!error) {
      await (campaigns || []).reduce(async (previousPromise, campaign) => {
        const { questionnaireIdsSuccess } = await previousPromise;
        questionnairesAccessible = simpleMerge(questionnairesAccessible, questionnaireIdsSuccess);
        i += 1;
        setCampaignProgress(getPercent(i, campaigns.length));
        return getAllCampaign(campaign);
      }, Promise.resolve({}));
    } else if (![404, 403, 500].includes(status)) throw new Error(statusText);

    return { surveyUnitsInTempZone, questionnairesAccessible };
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
