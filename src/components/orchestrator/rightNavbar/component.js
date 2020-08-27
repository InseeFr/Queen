import React from 'react';
import PropTypes from 'prop-types';
// import D from 'i18n';
import { StyleWrapper } from './component.style.js';

const NavBar = ({ nbModules, page, children }) => {
  const currentPage = page;
  const nbTotalPage = nbModules;

  return (
    <StyleWrapper>
      <div className="page">
        <div>n° page</div>
        <div>
          <b>{`${currentPage}/${nbTotalPage}`}</b>
        </div>
      </div>
      {children}
    </StyleWrapper>
  );
};

NavBar.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default React.memo(NavBar);
