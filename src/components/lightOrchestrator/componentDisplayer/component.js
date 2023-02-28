import * as lunatic from '@inseefr/lunatic';

import { useCustomLunaticStyles } from 'components/orchestrator/lunaticStyle/style';

export const ComponentDisplayer = ({
  components,
  preferences,
  features,
  readonly,
  missing,
  missingStrategy,
  savingType,
  filterDescription,
  missingShortcut,
  dontKnowButton,
  refusedButton,
  currentErrors,
}) => {
  const lunaticClasses = useCustomLunaticStyles();
  return (
    <>
      {components.map(function (component) {
        const { id, componentType, response, storeName, ...other } = component;
        const Component = lunatic[componentType];
        return (
          <div className={`${lunaticClasses.lunatic} ${componentType}`} key={`component-${id}`}>
            <Component
              id={id}
              response={response}
              {...other}
              {...component}
              labelPosition="TOP"
              unitPosition="AFTER"
              preferences={preferences}
              features={features}
              writable
              readOnly={readonly}
              disabled={readonly}
              focused // waiting for Lunatic feature
              missing={missing}
              missingStrategy={missingStrategy}
              savingType={savingType}
              filterDescription={filterDescription}
              missingShortcut={missingShortcut}
              dontKnowButton={dontKnowButton}
              refusedButton={refusedButton}
              shortcut={true}
              errors={currentErrors}
            />
          </div>
        );
      })}
    </>
  );
};
