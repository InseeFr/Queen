import { useAPI, useAsyncValue } from 'utils/hook';

export const usePutQuestionnairesInCache = () => {
  const { getQuestionnaire } = useAPI();

  const refreshGetQuestionnaire = useAsyncValue(getQuestionnaire);

  const putQuestionnairesInCache = async questionnaireIds => {
    const questionnaireIdsFailed = [];
    await (questionnaireIds || []).reduce(async (previousPromise, questionnaireId) => {
      await previousPromise;
      const getQuestionnaire = async () => {
        const { error, status, statusText } = await refreshGetQuestionnaire.current(
          questionnaireId
        );
        if (error) {
          if ([404, 403, 500].includes(status)) {
            questionnaireIdsFailed.push(questionnaireId);
          } else {
            throw new Error(statusText);
          }
        }
      };

      return getQuestionnaire();
    }, Promise.resolve());
    return questionnaireIdsFailed;
  };

  return putQuestionnairesInCache;
};
