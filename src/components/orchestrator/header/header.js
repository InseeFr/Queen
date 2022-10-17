import React, { useCallback, useContext, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import BreadcrumbQueen from '../breadcrumb';
import { useStyles } from './header.style';
import { ButtonBase, IconButton } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { OrchestratorContext } from '../queen';
import { paradataHandler, SIMPLE_CLICK_EVENT } from 'utils/events';

const Header = ({ title, hierarchy }) => {
  const { page, standalone, queenBindings, quit, setPage, currentPage } =
    useContext(OrchestratorContext);
  const classes = useStyles({ standalone });
  const setToFirstPage = useCallback(() => setPage('1'), [setPage]);
  const quitButtonRef = useRef();

  const utilInfo = type => {
    return {
      ...SIMPLE_CLICK_EVENT,
      idParadataObject: `${type}-button`,
      page: currentPage,
    };
  };
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
      <Navigation className={classes.headerItemNavigation} title={title} />
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
              onClick={paradataHandler(quit)(utilInfo('end-survey'))}
            >
              <ExitToApp htmlColor={'#000000'} />
            </IconButton>
          </div>
          <KeyboardEventHandler
            handleKeys={['alt+q']}
            onKeyEvent={paradataHandler(quitShortCut)(utilInfo('end-survey'))}
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
