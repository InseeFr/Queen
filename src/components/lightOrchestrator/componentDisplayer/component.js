import * as lunatic from '@inseefr/lunatic';

import { useCustomLunaticStyles } from 'components/orchestrator/lunaticStyle/style';

export const ComponentDisplayer = ({
  components,
  preferences,
  features,
  readonly,
  savingType,
  filterDescription,
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
              savingType={savingType}
              filterDescription={filterDescription}
              shortcut={true}
              errors={currentErrors}
            />
          </div>
        );
      })}
    </>
  );
};
