import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

export const usePutResourcesInCache = updateProgress => {
  const { getRequiredNomenclatures, getNomenclature } = useAPI();

  const refreshGetRequiredNomenclatures = useAsyncValue(getRequiredNomenclatures);
  const refreshGetNomenclature = useAsyncValue(getNomenclature);

  const putResourcesInCache = async campaignId => {
    const { data, error, statusText } = await refreshGetRequiredNomenclatures.current(campaignId);
    if (!error && data) {
      let i = 0;
      updateProgress(0);
      await data.reduce(async (previousPromise, resourceId) => {
        const { error, statusText } = await previousPromise;
        if (error) throw new Error(statusText);
        i += 1;
        updateProgress(getPercent(i, data.length));
        return refreshGetNomenclature.current(resourceId);
      }, Promise.resolve({}));
      updateProgress(100);
    } else {
      throw new Error(statusText);
    }
  };

  return putResourcesInCache;
};
