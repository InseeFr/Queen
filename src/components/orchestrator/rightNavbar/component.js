import React from 'react';
import PropTypes from 'prop-types';
// import D from 'i18n';
import styles from './navBar.scss';

const NavBar = ({ nbModules, page }) => {
  const currentPage = page;
  const nbTotalPage = nbModules;

  return (
    <>
      <style type="text/css">{styles}</style>
      <div id="navbar-right" className="navbar right">
        <span>{`Page ${currentPage} / ${nbTotalPage}`}</span>
      </div>
    </>
  );
};

NavBar.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default NavBar;
