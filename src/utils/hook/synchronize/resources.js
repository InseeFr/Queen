import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

export const usePutResourcesInCache = updateProgress => {
  const { getRequiredNomenclatures, getNomenclature } = useAPI();

  const refreshGetRequiredNomenclatures = useAsyncValue(getRequiredNomenclatures);
  const refreshGetNomenclature = useAsyncValue(getNomenclature);

  const putResourcesInCache = async campaignId => {
    const { data: resources, error, statusText } = await refreshGetRequiredNomenclatures.current(
      campaignId
    );
    if (!error) {
      let i = 0;
      updateProgress(0);
      await resources.reduce(async (previousPromise, resourceId) => {
        const { error: errorR, statusText: statusTextR } = await previousPromise;
        if (errorR) throw new Error(statusTextR);
        i += 1;
        updateProgress(getPercent(i, resources.length));
        return refreshGetNomenclature.current(resourceId);
      }, Promise.resolve());
      updateProgress(100);
    } else {
      throw new Error(statusText);
    }
  };

  return putResourcesInCache;
};
