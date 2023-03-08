import { useAPI, useAsyncValue } from 'utils/hook';

import { getPercent } from 'utils';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

const useSaveSUToLocalDataBase = () => {
  const { getUeData } = useAPI();

  const refreshGetUeData = useAsyncValue(getUeData);

  const saveSurveyUnit = async surveyUnit => {
    const { id } = surveyUnit; // surveyUnit : {id, questionnaireId}
    const { error, status, data, statusText } = await refreshGetUeData(id);
    if (!error) {
      await surveyUnitIdbService.addOrUpdateSU({
        ...surveyUnit,
        ...data,
      });
    } else if (![400, 403, 404, 500].includes(status)) throw new Error(statusText);
  };

  return saveSurveyUnit;
};

export const useSaveSUsToLocalDataBase = updateProgress => {
  const { getSurveyUnits } = useAPI();
  const saveSurveyUnit = useSaveSUToLocalDataBase();

  const refreshGetSurveyUnits = useAsyncValue(getSurveyUnits);

  const putSUS = async campaignId => {
    const { data, error, status, statusText } = await refreshGetSurveyUnits(campaignId);

    let i = 0;
    if (!error) {
      await (data || []).reduce(async (previousPromise, surveyUnit) => {
        await previousPromise;
        i += 1;
        updateProgress(getPercent(i, data.length));
        return saveSurveyUnit(surveyUnit);
      }, Promise.resolve());
      updateProgress(100);
    } else if (![400, 403, 404, 500].includes(status)) throw new Error(statusText);
  };

  return putSUS;
};

export const useSendSurveyUnits = updateProgress => {
  const { putUeData, putUeDataToTempZone } = useAPI();

  const putDataRef = useAsyncValue(putUeData);
  const putDataTempZoneRef = useAsyncValue(putUeDataToTempZone);
  const send = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    let i = 0;
    updateProgress(0);
    const surveyUnitsInTempZone = [];
    await surveyUnits.reduce(async (previousPromise, surveyUnit) => {
      await previousPromise;
      const { id, ...other } = surveyUnit;
      const sendSurveyUnit = async () => {
        const { error, status } = await putDataRef(id, other);
        if (error && [400, 403, 404, 500].includes(status)) {
          const { error: tempZoneError } = await putDataTempZoneRef(id, other);
          if (!tempZoneError) surveyUnitsInTempZone.push(id);
          else throw new Error('Server is not responding');
        }
        if (error && ![400, 403, 404, 500].includes(status))
          throw new Error('Server is not responding');
        i += 1;
        updateProgress(getPercent(i, surveyUnits.length));
      };
      return sendSurveyUnit();
    }, Promise.resolve());
    return surveyUnitsInTempZone;
  };

  return send;
};
