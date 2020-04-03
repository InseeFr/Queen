import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@inseefr/lunatic';
import D from 'i18n';
import styles from './buttons.scss';

const Buttons = ({ nbModules, page, pagePrevious, pageNext, pageFastForward, quit }) => {
  const btnDown = page === 0 ? '' : D.goBackReturn;
  const finalPage = nbModules - 1 === page ? D.saveAndQuit : `${D.nextContinue} \u2192`;
  const pageNextFunction = nbModules - 1 === page ? quit : pageNext;

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="buttons" className={`buttons ${!btnDown && 'btn-alone'}`}>
        {btnDown && <Button value={btnDown} onClick={pagePrevious} />}
        <Button value={finalPage} onClick={pageNextFunction} />
        <Button value={`${D.fastForward} \u21E5`} onClick={pageFastForward} />
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
