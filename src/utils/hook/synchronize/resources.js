import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

export const usePutResourcesInCache = updateProgress => {
  const { getRequiredNomenclatures, getNomenclature } = useAPI();

  const refreshGetRequiredNomenclatures = useAsyncValue(getRequiredNomenclatures);
  const refreshGetNomenclature = useAsyncValue(getNomenclature);

  const putResourcesInCache = async questionnaireId => {
    const {
      data,
      error: mainError,
      statusText: mainStatusText,
    } = await refreshGetRequiredNomenclatures.current(questionnaireId);
    if (!mainError && data) {
      updateProgress(0);
      await data.reduce(async (previousPromise, resourceId) => {
        const { error, statusText } = await previousPromise;
        if (error) throw new Error(statusText);
        return refreshGetNomenclature.current(resourceId);
      }, Promise.resolve({}));
      updateProgress(100);
    } else {
      throw new Error(mainStatusText);
    }
  };

  const putAllResourcesInCache = async questionnaireIds => {
    let i = 0;
    updateProgress(0);
    await questionnaireIds.reduce(async (previousPromise, questionnaireId) => {
      await previousPromise;
      i += 1;
      updateProgress(getPercent(i, questionnaireIds.length));
      return putResourcesInCache(questionnaireId);
    }, Promise.resolve({}));
  };

  return putAllResourcesInCache;
};
