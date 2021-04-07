import React, { useCallback, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import * as UQ from 'utils/questionnaire';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import CloseIcon from './quit.icon';
import BreadcrumbQueen from '../breadcrumb';
import { useStyles } from './header.style';

const Header = ({
  menuOpen,
  setMenuOpen,
  standalone,
  title,
  page,
  quit,
  hierarchy,
  questionnaire,
  bindings,
  setPage,
  validatePages,
}) => {
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
      <Navigation
        className={classes.headerItemNavigation}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        title={title}
        questionnaire={questionnaire}
        bindings={bindings}
        setPage={setPage}
        validatePages={validatePages}
      />
      <div className="header-item">
        <button
          type="button"
          className={classes.inseeIcon}
          title={D.backToBeginning}
          onClick={setToFirstPage}
        >
          <img id="logo" src={insee} alt="Logo de L'Insee" className={classes.headerLogo} />
        </button>
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
            <button ref={quitButtonRef} type="button" className={classes.closeIcon} onClick={quit}>
              <CloseIcon width={40} />
            </button>
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
