import { DEFAULT_DATA_URL, OIDC } from 'utils/constants';
import { useCallback, useContext, useEffect, useState } from 'react';

import { API } from 'utils/api';
import { AppContext } from 'components/app';
import Dictionary from 'i18n';
import clearAllData from 'utils/indexedbb/services/allTables-idb-service';
import { getFetcherForLunatic } from 'utils/api/fetcher';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useAsyncValue } from '.';
import { useAuth } from './auth';

const clean = async (standalone = false) => {
  try {
    if (standalone) {
      await clearAllData();
      await caches.delete('queen-questionnaire');
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

const getErrorMessage = (response, type = 'q') => {
  const { status } = response;
  if (status === 401) return Dictionary.getError401;
  if (status === 403) return Dictionary.getError403(type);
  if (status === 404) return Dictionary.getError404(type);
  if (status >= 500 && status < 600) return Dictionary.getErrorServeur;
  return Dictionary.getUnknownError;
};

export const useLunaticFetcher = () => {
  const { authenticationType, getOidcUser } = useAuth();

  const lunaticFetcher = useCallback(
    (url, options) => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return getFetcherForLunatic(token)(url, options);
    },
    [authenticationType, getOidcUser]
  );

  return { lunaticFetcher };
};

export const useAPI = () => {
  const { authenticationType, getOidcUser } = useAuth();
  const { apiUrl } = useContext(AppContext);

  const getCampaigns = useCallback(() => {
    const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
    return API.getCampaigns(apiUrl)(token);
  }, [apiUrl, authenticationType, getOidcUser]);

  const getQuestionnaire = useCallback(
    questionnaireID => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.getQuestionnaire(apiUrl)(questionnaireID)(token);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const getRequiredNomenclatures = useCallback(
    id => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.getRequiredNomenclatures(apiUrl)(id)(token);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const getSurveyUnits = useCallback(
    id => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.getSurveyUnits(apiUrl)(id)(token);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const getNomenclature = useCallback(
    id => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.getNomenclature(apiUrl)(id)(token);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const getUeData = useCallback(
    surveyUnitID => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.getUeData(apiUrl)(surveyUnitID)(token);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const putUeData = useCallback(
    (surveyUnitID, body) => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.putUeData(apiUrl)(surveyUnitID)(token)(body);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const putUeDataToTempZone = useCallback(
    (surveyUnitID, body) => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.putUeDataToTempZone(apiUrl)(surveyUnitID)(token)(body);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  const postParadata = useCallback(
    body => {
      const token = authenticationType === OIDC ? getOidcUser()?.access_token : null;
      return API.postParadata(apiUrl)(token)(body);
    },
    [apiUrl, authenticationType, getOidcUser]
  );

  return {
    getCampaigns,
    getSurveyUnits,
    getRequiredNomenclatures,
    getNomenclature,
    getQuestionnaire,
    getUeData,
    putUeData,
    putUeDataToTempZone,
    postParadata,
  };
};

export const useGetSurveyUnit = () => {
  const { getUeData } = useAPI();
  const refreshGetData = useAsyncValue(getUeData);

  return async (idSurveyUnit, standalone = false) => {
    try {
      if (standalone) {
        const dR = await refreshGetData(idSurveyUnit);
        if (!dR.error && dR.status !== 404) {
          await surveyUnitIdbService.addOrUpdateSU({
            id: idSurveyUnit,
            ...dR.data,
          });
        } else return dR;
      }
      return { surveyUnit: await surveyUnitIdbService.get(idSurveyUnit) };
    } catch (error) {
      return { error };
    }
  };
};
export const useAPIRemoteData = (surveyUnitID, questionnaireID) => {
  const { standalone } = useContext(AppContext);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [nomenclatures, setNomenclatures] = useState(null);
  const [surveyUnit, setSurveyUnit] = useState(null);

  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { getQuestionnaire, getRequiredNomenclatures } = useAPI();
  const getSurveyUnit = useGetSurveyUnit();

  useEffect(() => {
    if (questionnaireID && surveyUnitID && !questionnaire && !surveyUnit) {
      setErrorMessage(null);
      setQuestionnaire(null);
      setNomenclatures(null);
      setSurveyUnit(null);
      const load = async () => {
        setLoadingMessage(Dictionary.waitingCleaning);
        const { error } = await clean(standalone);
        if (!error) {
          setLoadingMessage(Dictionary.waitingQuestionnaire);
          const qR = await getQuestionnaire(questionnaireID);
          const nR = await getRequiredNomenclatures(questionnaireID);
          if (!qR.error && !nR.error && qR.status !== 404) {
            setQuestionnaire(qR.data.value);
            setNomenclatures(nR.data);
            setLoadingMessage(Dictionary.waitingDataSU);
            const suR = await getSurveyUnit(surveyUnitID, standalone);
            if (!suR.error && suR.surveyUnit) {
              setSurveyUnit(suR.surveyUnit);
              setLoadingMessage(null);
            } else setErrorMessage(getErrorMessage(suR, 'd'));
            setLoadingMessage(null);
          } else setErrorMessage(getErrorMessage(qR, 'q'));
          setLoadingMessage(null);
        } else setErrorMessage('Pb when cleaning database');
        setLoadingMessage(null);
      };
      load();
    }
    // assume that we don't resend request to get data and questionnaire when token was refreshed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyUnitID, questionnaireID]);

  return { loadingMessage, errorMessage, surveyUnit, questionnaire, nomenclatures };
};

export const useRemoteData = (questionnaireUrl, dataUrl) => {
  const { standalone } = useContext(AppContext);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [nomenclatures, setNomenclatures] = useState(null);
  const [surveyUnit, setSurveyUnit] = useState(null);

  const [loadingMessage, setLoadingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (questionnaireUrl) {
      setErrorMessage(null);
      setQuestionnaire(null);
      setNomenclatures(null);
      setSurveyUnit(null);
      const fakeToken = null;
      const load = async () => {
        setLoadingMessage(Dictionary.waitingCleaning);
        const { error } = await clean(standalone);
        if (!error) {
          setLoadingMessage(Dictionary.waitingQuestionnaire);
          const qR = await API.getRequest(questionnaireUrl)(fakeToken);
          if (!qR.error) {
            setQuestionnaire(qR.data);
            setNomenclatures([]); // fake nomenclatures for vizu
            setLoadingMessage(Dictionary.waintingData);
            const dR = await API.getRequest(dataUrl || DEFAULT_DATA_URL)(fakeToken);
            if (!dR.error) {
              setSurveyUnit(dR.data);
              setLoadingMessage(null);
            } else setErrorMessage(getErrorMessage(dR, 'd'));
            setLoadingMessage(null);
          } else setErrorMessage(getErrorMessage(qR, 'q'));
          setLoadingMessage(null);
        } else setErrorMessage('Pb when cleaning database');
        setLoadingMessage(null);
      };
      load();
    }
  }, [questionnaireUrl, dataUrl, standalone]);

  return { loadingMessage, errorMessage, surveyUnit, questionnaire, nomenclatures };
};
