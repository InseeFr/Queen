import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import CloseIcon from './quit.icon';
import BreadcrumbQueen from '../breadcrumb';
import { StyleWrapper } from './header.style.js';

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
          <img id="logo" src={insee} alt="Insee-logo" className="header-logo" />
        </button>
      </div>
      <div className="header-item header-title">
        <span id="header-title">{title}</span>
        {sequence && <BreadcrumbQueen sequence={sequence} subsequence={subsequence} />}
      </div>
      {!standalone && (
        <div className="header-item header-close">
          <button type="button" className="close-icon" onClick={quit}>
            <CloseIcon width={40} />
          </button>
        </div>
      )}
    </StyleWrapper>
  );
};
const comparison = (prevProps, nextProps) => {
  return (
    !nextProps.menuOpen &&
    prevProps.sequence === nextProps.sequence &&
    prevProps.subsequence === nextProps.subsequence
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default React.memo(Header, comparison);
