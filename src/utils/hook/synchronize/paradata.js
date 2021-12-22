import paradataIdbService from 'utils/indexedbb/services/paradata-idb-service';
import { useAPI, useAsyncValue } from 'utils/hook';
import { getPercent } from 'utils';

export const useSendParadatas = updateProgress => {
  const { postParadata } = useAPI();
  const postParadataRef = useAsyncValue(postParadata);

  const send = async () => {
    const paradatas = await paradataIdbService.getAll();
    let i = 0;
    updateProgress(0);
    const paradatasInError = [];
    await paradatas.reduce(async (previousPromise, paradata) => {
      await previousPromise;
      const sendParadata = async () => {
        const { error } = await postParadataRef.current(paradata);
        if (error) {
          paradatasInError.push(paradata);
          throw new Error('Server is not responding');
        }
        i += 1;
        updateProgress(getPercent(i, paradatas.length));
      };
      return sendParadata();
    }, Promise.resolve());
    return paradatasInError;
  };

  return send;
};
