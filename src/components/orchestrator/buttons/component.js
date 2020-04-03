import React from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import styles from './buttons.scss';

const Buttons = ({ nbModules, page, pagePrevious, pageNext, pageFastForward, quit }) => {
  const returnLabel = page === 0 ? '' : D.goBackReturn;
  const nextLabel = nbModules - 1 === page ? D.saveAndQuit : `${D.nextContinue} \u2192`;
  const pageNextFunction = nbModules - 1 === page ? quit : pageNext;

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="buttons" className={`buttons ${!returnLabel && 'btn-alone'}`}>
        {returnLabel && (
          <button className="navigation-button" type="button" onClick={pagePrevious}>
            {returnLabel}
          </button>
        )}
        <button className="navigation-button" type="button" onClick={pageNextFunction}>
          {nextLabel}
        </button>
        <button className="navigation-button" type="button" onClick={pageFastForward}>
          {`${D.fastForward} \u21E5`}
        </button>
      </div>
    </>
  );
};
Buttons.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageNext: PropTypes.func.isRequired,
  pagePrevious: PropTypes.func.isRequired,
  pageFastForward: PropTypes.func.isRequired,
  quit: PropTypes.func.isRequired,
};

export default Buttons;
