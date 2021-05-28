import React, { useCallback, useContext, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { OrchestratorContext } from 'components/orchestrator';
import * as UQ from 'utils/questionnaire';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import BreadcrumbQueen from '../breadcrumb';
import { useStyles } from './header.style';
import { ButtonBase, IconButton } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

const Header = ({ title, quit, hierarchy, setPage }) => {
  const { bindings, page, standalone } = useContext(OrchestratorContext);
  const classes = useStyles({ standalone });
  const setToFirstPage = useCallback(() => setPage('1'), [setPage]);
  const quitButtonRef = useRef();

  const queenBindings = UQ.getQueenBindings(bindings)(page);

  const { sequence, subSequence } = hierarchy || {};

  const sequenceBinded = {
    ...sequence,
    label: lunatic.interpret(['VTL'])(queenBindings)(sequence?.label),
  };

  const subSequenceBinded = subSequence
    ? {
        ...subSequence,
        label: lunatic.interpret(['VTL'])(queenBindings)(subSequence?.label),
      }
    : null;

  const quitShortCut = () => {
    if (quitButtonRef && quitButtonRef.current) quitButtonRef.current.focus();
    quit();
  };

  return (
    <div className={classes.root}>
      <Navigation className={classes.headerItemNavigation} title={title} setPage={setPage} />
      <div className="header-item">
        <ButtonBase
          focusRipple
          onClick={setToFirstPage}
          aria-label={D.backToBeginning}
          title={D.backToBeginning}
        >
          <img id="logo" src={insee} alt="Logo de L'Insee" className={classes.headerLogo} />
        </ButtonBase>
      </div>
      <div className={classes.headerTitle}>
        <span className={classes.questionnaireTitle}>{title}</span>
        {sequence && (
          <BreadcrumbQueen
            sequence={sequenceBinded}
            subsequence={subSequenceBinded}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      {!standalone && (
        <>
          <div className={classes.headerClose}>
            <IconButton
              ref={quitButtonRef}
              title={D.simpleQuit}
              className={classes.closeIcon}
              onClick={quit}
            >
              <ExitToApp htmlColor={'#000000'} />
            </IconButton>
          </div>
          <KeyboardEventHandler
            handleKeys={['alt+q']}
            onKeyEvent={quitShortCut}
            handleFocusableElements
          />
        </>
      )}
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
