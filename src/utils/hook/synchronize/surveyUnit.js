import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

const useSaveSUToLocalDataBase = () => {
  const { getData, getComment } = useAPI();

  const refreshGetData = useAsyncValue(getData);
  const refreshGetComment = useAsyncValue(getComment);

  const saveSurveyUnit = async id => {
    const dR = await refreshGetData.current(id);
    const cR = await refreshGetComment.current(id);
    if (!dR.error && !cR.error) {
      await surveyUnitIdbService.addOrUpdateSU({
        id,
        ...dR.data,
        comment: cR.data,
      });
    } else {
      throw new Error(dR.statusText || cR.statusText);
    }
  };

  return saveSurveyUnit;
};

export const useSaveSUsToLocalDataBase = updateProgress => {
  const { getSurveyUnits } = useAPI();
  const saveSurveyUnit = useSaveSUToLocalDataBase();

  const refrehGetSurveyUnits = useAsyncValue(getSurveyUnits);

  const putSUS = async campaignId => {
    const { data: surveyUnits, error, statusText } = await refrehGetSurveyUnits.current(campaignId);

    let i = 0;
    if (!error) {
      await surveyUnits.reduce(
        async (previousPromise, { id }) => {
          await previousPromise;
          i += 1;
          updateProgress(getPercent(i, surveyUnits.length));
          return saveSurveyUnit(id);
        },
        id => Promise.resolve()
      );
      updateProgress(100);
    } else {
      throw new Error(statusText);
    }
  };

  return putSUS;
};

export const useSendSurveyUnits = updateProgress => {
  const { putData, putComment } = useAPI();

  const putDataRef = useAsyncValue(putData);
  const putCommentRef = useAsyncValue(putComment);

  const send = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    let i = 0;
    updateProgress(0);
    await surveyUnits.reduce(async (previousPromise, surveyUnit) => {
      await previousPromise;
      const { id, comment, ...other } = surveyUnit;
      const sendSurveyUnit = async () => {
        const { error: putDataError } = await putDataRef.current(id, other);
        const { error: putCommentError } = await putCommentRef.current(id, comment);
        if (putDataError || putCommentError) throw new Error(putDataError || putCommentError);
        i += 1;
        updateProgress(getPercent(i, surveyUnits.length));
      };
      return sendSurveyUnit();
    }, Promise.resolve());
  };

  return send;
};
