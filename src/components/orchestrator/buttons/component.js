import React, { useState } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { DIRECT_CONTINUE_COMPONENTS, REFUSAL, DOESNT_KNOW } from 'utils/constants';
import styles from './buttons.scss';

const Buttons = ({
  canContinue,
  previousClicked,
  componentType,
  nbModules,
  page,
  pagePrevious,
  pageNext,
  setSpecialAnswer,
  pageFastForward,
  quit,
}) => {
  const returnLabel = page === 0 ? '' : D.goBackReturn;
  const nextLabel = nbModules - 1 === page ? D.saveAndQuit : `${D.nextContinue} \u2192`;
  const pageNextFunction = nbModules - 1 === page ? quit : pageNext;

  const [refusalChecked, setRefusalChecked] = useState(false);

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="buttons" className={`buttons ${!returnLabel && 'btn-alone'}`}>
        {!['Sequence', 'Subsequence'].includes(componentType) && (
          <>
            <button className="specific-modality" type="button">
              Commentaire
            </button>
            <button
              type="button"
              className={`specific-modality ${refusalChecked ? 'content-checked' : ''}`}
              onClick={() => setRefusalChecked(!refusalChecked)}
            >
              <span className="shortcut">F2</span>
              {D.refusalButton}
              <span className={refusalChecked ? 'checked' : 'unchecked'}>✓</span>
            </button>
            {/* <button
              className="specific-modality"
              type="button"
              onClick={() => setSpecialAnswer(REFUSAL)}
            >
              <span>F2</span>
              {D.refusalButton}
            </button>
            <button
              className="specific-modality"
              type="button"
              onClick={() => setSpecialAnswer(DOESNT_KNOW)}
            >
              <span>F3</span>
              {D.doesntKnowButton}
            </button> */}
          </>
        )}
        {returnLabel && (
          <button className="navigation-button" type="button" onClick={pagePrevious}>
            {returnLabel}
          </button>
        )}
        {!DIRECT_CONTINUE_COMPONENTS.includes(componentType) && !previousClicked && (
          <button
            className="navigation-button"
            type="button"
            onClick={pageNextFunction}
            disabled={!canContinue}
          >
            {nextLabel}
          </button>
        )}

        <button className="navigation-button" type="button" onClick={pageFastForward}>
          {`${D.fastForward} \u21E5`}
        </button>
      </div>
    </>
  );
};

Buttons.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  previousClicked: PropTypes.bool.isRequired,
  componentType: PropTypes.string.isRequired,
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageNext: PropTypes.func.isRequired,
  setSpecialAnswer: PropTypes.func.isRequired,
  pagePrevious: PropTypes.func.isRequired,
  pageFastForward: PropTypes.func.isRequired,
  quit: PropTypes.func.isRequired,
};

export default Buttons;
