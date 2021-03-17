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

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

export const useSynchronisation = () => {
  const { getCampaigns, getQuestionnaire } = useAPI();

  const refrehGetCampaigns = useAsyncValue(getCampaigns);
  const refrehGetQuestionnaire = useAsyncValue(getQuestionnaire);

  const [waitingMessage, setWaitingMessage] = useState(null);
  const [sendingProgress, setSendingProgress] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(null);
  const [resourceProgress, setResourceProgress] = useState(0);
  const [surveyUnitProgress, setSurveyUnitProgress] = useState(0);
  const [current, setCurrent] = useState(null);

  const sendData = useSendSurveyUnits(setSendingProgress);
  const putResourcesInCache = usePutResourcesInCache(setResourceProgress);
  const saveSurveyUnitsToLocalDataBase = useSaveSUsToLocalDataBase(setSurveyUnitProgress);

  const getAllCampaign = async id => {
    setResourceProgress(0);
    setSurveyUnitProgress(0);
    setCurrent('questionnaire');
    const { error, statusText } = await refrehGetQuestionnaire.current(id);
    if (error) throw new Error(statusText);
    setCurrent('resources');
    await putResourcesInCache(id);
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

    await campaigns.reduce(async (previousPromise, { id }) => {
      await previousPromise;
      i += 1;
      setCampaignProgress(getPercent(i, campaigns.length));
      return getAllCampaign(id);
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
