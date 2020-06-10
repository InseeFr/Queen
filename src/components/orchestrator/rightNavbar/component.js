import React from 'react';
import PropTypes from 'prop-types';
// import D from 'i18n';
import { StyleWrapper } from './component.style.js';

const NavBar = ({ nbModules, page }) => {
  const currentPage = page;
  const nbTotalPage = nbModules;

  return (
    <StyleWrapper>
      <span>{`Page ${currentPage} / ${nbTotalPage}`}</span>
    </StyleWrapper>
  );
};

NavBar.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default React.memo(NavBar);
