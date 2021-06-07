import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

const useSaveSUToLocalDataBase = () => {
  const { getUeData } = useAPI();

  const refreshGetUeData = useAsyncValue(getUeData);

  const saveSurveyUnit = async surveyUnit => {
    const { id } = surveyUnit; // surveyUnit : {id, questionnaireId}
    const dR = await refreshGetUeData.current(id);
    if (!dR.error) {
      await surveyUnitIdbService.addOrUpdateSU({
        ...surveyUnit,
        ...dR.data,
      });
    } else {
      throw new Error(dR.statusText);
    }
  };

  return saveSurveyUnit;
};

export const useSaveSUsToLocalDataBase = updateProgress => {
  const { getSurveyUnits } = useAPI();
  const saveSurveyUnit = useSaveSUToLocalDataBase();

  const refrehGetSurveyUnits = useAsyncValue(getSurveyUnits);

  const putSUS = async campaignId => {
    const { data, error, statusText } = await refrehGetSurveyUnits.current(campaignId);

    let i = 0;
    if (!error) {
      await (data || []).reduce(async (previousPromise, surveyUnit) => {
        await previousPromise;
        i += 1;
        updateProgress(getPercent(i, data.length));
        return saveSurveyUnit(surveyUnit);
      }, Promise.resolve());
      updateProgress(100);
    } else {
      throw new Error(statusText);
    }
  };

  return putSUS;
};

export const useSendSurveyUnits = updateProgress => {
  const { putUeData } = useAPI();

  const putDataRef = useAsyncValue(putUeData);

  const send = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    let i = 0;
    updateProgress(0);
    await surveyUnits.reduce(async (previousPromise, surveyUnit) => {
      await previousPromise;
      const { id, ...other } = surveyUnit;
      const sendSurveyUnit = async () => {
        const { error: putDataError } = await putDataRef.current(id, other);
        if (putDataError) throw new Error(putDataError);
        i += 1;
        updateProgress(getPercent(i, surveyUnits.length));
      };
      return sendSurveyUnit();
    }, Promise.resolve());
  };

  return send;
};
