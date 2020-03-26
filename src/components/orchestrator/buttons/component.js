import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@inseefr/lunatic';
import D from '../../../i18n';
import styles from './buttons.scss';

const Buttons = ({ nbModules, page, pageUp, pageDown, save }) => {
  const btnDown = page === 0 ? '' : D.goBackReturn;
  const finalPage = nbModules - 1 === page ? D.saveAndQuit : `${D.nextContinue} \u2192`;
  const finalPageFunction = nbModules - 1 === page ? save : pageUp;

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="buttons" className={`buttons ${!btnDown && 'btn-alone'}`}>
        {btnDown && <Button value={btnDown} onClick={pageDown} />}
        <Button value={finalPage} onClick={finalPageFunction} />
      </div>
    </>
  );
};
Buttons.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageUp: PropTypes.func.isRequired,
  pageDown: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export default Buttons;
