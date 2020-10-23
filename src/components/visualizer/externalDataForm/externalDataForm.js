import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as UQ from 'utils/questionnaire';
import D from 'i18n';
import { version } from '../../../../package.json';

const ExternalDataForm = ({ externalData, setData }) => {
  const [values, setValues] = useState(() =>
    Object.keys(externalData).reduce((init, name) => {
      const newVar = init;
      newVar[name] = '';
      return newVar;
    }, {})
  );

  const onSubmit = e => {
    setData(UQ.buildSpecialQueenData({ EXTERNAL: values }));
    e.preventDefault();
  };

  const handleChange = ({ target: { name: n, value: v } }) => {
    const newExternal = values;
    newExternal[n] = v;
    setValues({ ...newExternal });
  };

  return (
    <>
      <div className="visualize-content">
        <h1 className="title">{D.externalVariablesTitlePage}</h1>
        <div className="information">{D.visualizeInformations(Object.keys(values).length)}</div>
        <div className="information">{D.visualizeInstructions(Object.keys(values).length)}</div>
        <form onSubmit={onSubmit}>
          <div className="variables-form">
            {Object.keys(values).map((variable, index) => {
              return (
                <div key={variable} className="form-group">
                  <label
                    htmlFor={`input-variables-${variable}`}
                    id={`label-input-variables-${variable}`}
                    className="label-input-variables"
                  >
                    {`${variable} :`}
                  </label>
                  <input
                    autoFocus={index === 0}
                    id={`input-variables-${variable}`}
                    name={variable}
                    type="input"
                    value={values[variable]}
                    placeholder={variable}
                    onChange={handleChange}
                    className="input-variables"
                  />
                </div>
              );
            })}
          </div>
          <input type="submit" className="button-questionnaire" value={D.visualize} />
        </form>
      </div>
      <div className="version">{`Version ${version}`}</div>
    </>
  );
};

ExternalDataForm.propTypes = {
  externalData: PropTypes.objectOf(PropTypes.any).isRequired,
  setData: PropTypes.func.isRequired,
};

export default ExternalDataForm;
