import React, { useCallback, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import CloseIcon from './quit.icon';
import BreadcrumbQueen from '../breadcrumb';
import { StyleWrapper } from './header.style';

const Header = ({
  menuOpen,
  setMenuOpen,
  standalone,
  title,
  quit,
  sequence,
  subsequence,
  questionnaire,
  bindings,
  setPage,
  validatePages,
}) => {
  const setToFirstPage = useCallback(() => setPage(1), [setPage]);
  const quitButtonRef = useRef();

  const sequenceBinded = {
    ...sequence,
    label: lunatic.interpret(['VTL'])(bindings)(sequence.label),
  };

  const subSequenceBinded = subsequence
    ? {
        ...subsequence,
        label: lunatic.interpret(['VTL'])(bindings)(subsequence.label),
      }
    : null;

  const quitShortCut = () => {
    if (quitButtonRef && quitButtonRef.current) quitButtonRef.current.focus();
    quit();
  };

  return (
    <StyleWrapper className={`${standalone ? 'standalone' : ''}`}>
      <Navigation
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
          className="insee-icon"
          title={D.backToBeginning}
          onClick={setToFirstPage}
        >
          <img id="logo" src={insee} alt="Logo de L'Insee" className="header-logo" />
        </button>
      </div>
      <div className="header-item header-title">
        <span className="questionnaire-title">{title}</span>
        {sequence && (
          <BreadcrumbQueen
            sequence={sequenceBinded}
            subsequence={subSequenceBinded}
            setPage={setPage}
          />
        )}
      </div>
      {!standalone && (
        <>
          <div className="header-item header-close">
            <button ref={quitButtonRef} type="button" className="close-icon" onClick={quit}>
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
    </StyleWrapper>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
