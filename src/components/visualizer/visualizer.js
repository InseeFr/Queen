import { AppContext } from 'components/app';
import Orchestrator from 'components/orchestrator';
import Error from 'components/shared/Error';
import Preloader from 'components/shared/preloader';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useRemoteData, useVisuQuery } from 'utils/hook';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { checkQuestionnaire, downloadDataAsJson } from 'utils/questionnaire';
import QuestionnaireForm from './questionnaireForm';

const Visualizer = () => {
  const { apiUrl, standalone } = useContext(AppContext);

  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const { questionnaireUrl, dataUrl, readonly, nomenclatures } = useVisuQuery();
  const { surveyUnit: suData, questionnaire, loadingMessage, errorMessage } = useRemoteData(
    questionnaireUrl,
    dataUrl
  );

  const [suggesters] = useState(nomenclatures);
  const history = useHistory();

  const createFakeSurveyUnit = surveyUnit => {
    const unit = {
      ...surveyUnit,
      id: '1234',
    };
    surveyUnitIdbService.addOrUpdateSU(unit);
    return unit;
  };

  useEffect(() => {
    if (questionnaireUrl && questionnaire && suData) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
        setSurveyUnit(createFakeSurveyUnit(suData));
      } else {
        setError(questionnaireError);
      }
    }
  }, [questionnaireUrl, questionnaire, suData, apiUrl]);

  useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);

  const closeAndDownloadData = async () => {
    const data = await surveyUnitIdbService.get('1234');
    downloadDataAsJson(data, 'data');
    history.push('/');
  };

  return (
    <>
      {loadingMessage && <Preloader message={loadingMessage} />}
      {error && <Error message={error} />}
      {questionnaireUrl && source && surveyUnit && suggesters && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
          suggesters={suggesters}
          autoSuggesterLoading
          standalone={standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          pagination={true}
          missing={true}
          filterDescription={false}
          save={unit => surveyUnitIdbService.addOrUpdateSU(unit)}
          close={closeAndDownloadData}
        />
      )}
      {!questionnaireUrl && <QuestionnaireForm />}
    </>
  );
};

export default Visualizer;
