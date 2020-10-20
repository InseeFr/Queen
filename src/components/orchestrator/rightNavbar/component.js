import React from 'react';
import PropTypes from 'prop-types';
import { StyleWrapper } from './component.style';

const NavBar = ({ nbModules, page, children }) => {
  const currentPage = page;
  const nbTotalPage = nbModules;

  return (
    <StyleWrapper className="nav-bar">
      <div className="page">
        <div className="label-page">n° page</div>
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
