import React from 'react';
import PropTypes from 'prop-types';
import insee from '../../../img/insee.png';
import Navigation from '../navigation';
import CloseIcon from './quit.icon';
import sendEvent from '../../../utils/event';
import BreadcrumbQueen from '../breadcrumb';
import styles from './header.scss';

const Header = ({
  title,
  sequence,
  subsequence,
  components,
  bindings,
  setPage,
  viewedPages,
  setNavOpen,
}) => {
  const quitQueen = () => {
    console.log('quit queen ');
    sendEvent({ action: 'close-queen' });
  };
  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="survey-title" className="header">
        <img id="logo" src={insee} alt="Insee-logo" className="header-logo" />
        <Navigation
          components={components}
          bindings={bindings}
          setPage={setPage}
          viewedPages={viewedPages}
          setNavOpen={setNavOpen}
        />
        <div className="header-title">
          <span id="header-title">{title}</span>
          {sequence && <BreadcrumbQueen sequence={sequence} subsequence={subsequence} />}
        </div>
        <button type="button" className="close-icon" onClick={quitQueen}>
          <CloseIcon width={40} />
        </button>
      </div>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
