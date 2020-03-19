import React from 'react';
import PropTypes from 'prop-types';
import insee from '../../../img/insee.png';
import Navigation from '../navigation';
import Quitcon from './quit.icon';
import sendEvent from '../../../utils/event';
import BreadcrumbQueen from '../breadcrumb';
import styles from './header.scss';

const Header = ({ title, sequence, subsequence, components, bindings, setPage, viewedPages }) => {
  const quitQueen = () => {
    console.log('quit queen ');
    sendEvent({ action: 'close-queen' });
  };
  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="survey-title" className="header">
        <div className="header-logo">
          <img id="logo" src={insee} alt="Insee-logo" />
        </div>
        <Navigation
          components={components}
          bindings={bindings}
          setPage={setPage}
          viewedPages={viewedPages}
        />
        <div className="header-title">
          <span id="header-title">{title}</span>
          {sequence && <BreadcrumbQueen sequence={sequence} subsequence={subsequence} />}
        </div>
        <button className="quit-icon" onClick={quitQueen}>
          <Quitcon width={40} />
        </button>
      </div>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
