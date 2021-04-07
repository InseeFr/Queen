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
    const { id, questionnairesId } = campaign;
    setResourceProgress(0);
    setSurveyUnitProgress(0);
    setCurrent('questionnaire');
    await putQuestionnairesInCache(questionnairesId);
    setCurrent('resources');
    await putAllResourcesInCache(questionnairesId);
    setCurrent('survey-units');
    await saveSurveyUnitsToLocalDataBase(id);
    setCurrent(null);
  };

  const synchronize = async () => {
    // (2) : send the local data to server
    setWaitingMessage(D.waitingSendingData);
    setCurrent('send');
    await sendData();

    setSendingProgress(null);

    // (3) : clean
    setCurrent('clean');
    setWaitingMessage(D.waitingCleaning);
    await clean();

    // (4) : Get the data
    setWaitingMessage(D.waintingData);
    const campaignsResponse = await refrehGetCampaigns.current();
    const campaigns = await campaignsResponse.data;
    let i = 0;
    setCampaignProgress(0);

    await campaigns.reduce(async (previousPromise, campaign) => {
      await previousPromise;
      i += 1;
      setCampaignProgress(getPercent(i, campaigns.length));
      return getAllCampaign(campaign);
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
