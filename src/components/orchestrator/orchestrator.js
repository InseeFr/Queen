import * as lunatic from '@inseefr/lunatic';

import PropTypes from 'prop-types';
import QueenOrchestrator from 'components/orchestrator/queen';
import React from 'react';
import { getCalculatedVariablesFromSource } from 'utils/questionnaire';
import { useLunaticFetcher } from 'utils/hook';

const Orchestrator = ({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  pagination,
  missing,
  features,
  source,
  suggesters,
  autoSuggesterLoading,
  filterDescription,
  save,
  close,
}) => {
  const { data } = surveyUnit;
  const { lunaticFetcher: suggesterFetcher } = useLunaticFetcher();
  const calculatedVariables = getCalculatedVariablesFromSource(source);
  const lunaticResult = lunatic.useLunaticSplit(source, data, {
    savingType,
    preferences,
    features,
    pagination,
    suggesters,
    autoSuggesterLoading,
    suggesterFetcher,
  });

  return (
    <QueenOrchestrator
      source={source}
      surveyUnit={surveyUnit}
      lunatic={lunaticResult}
      save={save}
      close={close}
      readonly={readonly}
      standalone={standalone}
      preferences={preferences}
      features={features}
      missing={missing}
      pagination={pagination}
      savingType={savingType}
      filterDescription={filterDescription}
      calculatedVariables={calculatedVariables}
    />
  );
};

Orchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  standalone: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default React.memo(Orchestrator);
