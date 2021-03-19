import { useAPI, useAsyncValue } from 'utils/hook';

export const usePutQuestionnairesInCache = () => {
  const { getQuestionnaire } = useAPI();

  const refreshGetQuestionnaire = useAsyncValue(getQuestionnaire);

  const putQuestionnairesInCache = async questionnairesId => {
    await questionnairesId.reduce(async (previousPromise, questionnaireId) => {
      const { error, statusText } = await previousPromise;
      if (error) {
        throw new Error(statusText);
      }
      return refreshGetQuestionnaire.current(questionnaireId);
    }, Promise.resolve({}));
  };

  return putQuestionnairesInCache;
};
