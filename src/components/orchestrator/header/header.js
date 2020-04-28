import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import insee from 'img/insee.png';
import Navigation from '../navigation';
import CloseIcon from './quit.icon';
import BreadcrumbQueen from '../breadcrumb';
import styles from './header.scss';

const Header = ({
  standalone,
  title,
  quit,
  sequence,
  subsequence,
  components,
  bindings,
  setPage,
  viewedPages,
  setNavOpen,
}) => {
  const setToFirstPage = useCallback(() => setPage(1), []);

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="survey-title" className={`header${standalone ? ' standalone' : ''}`}>
        <Navigation
          components={components}
          bindings={bindings}
          setPage={setPage}
          viewedPages={viewedPages}
          setNavOpen={setNavOpen}
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
      </div>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
