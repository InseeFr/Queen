import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Preloader from 'components/shared/preloader';
import { useGetSurveyUnit } from 'utils/hook';
import D from 'i18n';
import Error from 'components/shared/Error';
import { Redirect } from 'react-router';
import { AppContext } from 'components/app';

const QueenRedirect = () => {
  const { standalone } = useContext(AppContext);
  const { readonly, idSU } = useParams();
  const getSurveyUnit = useGetSurveyUnit();

  const [idQuestionnaire, setIdQuestionnaire] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!idQuestionnaire && !errorMessage) {
      const load = async () => {
        const response = await getSurveyUnit(idSU, standalone);
        if (!response.error && response.surveyUnit && response.surveyUnit.questionnaireId) {
          setIdQuestionnaire(response.surveyUnit.questionnaireId);
        } else setErrorMessage(`${D.failedToLoadSurveyUnit} ${idSU}.`);
      };
      load();
    }
  }, [getSurveyUnit, errorMessage, idQuestionnaire, idSU, standalone]);

  return (
    <>
      {errorMessage && <Error message={errorMessage} />}
      {!errorMessage && !idQuestionnaire && <Preloader message={D.waintingData} />}
      {!errorMessage && idQuestionnaire && (
        <Redirect
          to={`/queen${
            readonly ? `/${readonly}` : ''
          }/questionnaire/${idQuestionnaire}/survey-unit/${idSU}`}
        />
      )}
    </>
  );
};

export default QueenRedirect;
