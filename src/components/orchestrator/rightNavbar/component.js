import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './component.style';

const NavBar = ({ nbModules, page, children }) => {
  const classes = useStyles();

  const currentPage = page;
  const nbTotalPage = nbModules;

  return (
    <div className={classes.root}>
      <div className={classes.page}>
        <div className={classes.labelPage}>n° page</div>
        <div>
          <b>{`${currentPage}/${nbTotalPage}`}</b>
        </div>
      </div>
      {children}
    </div>
  );
};

NavBar.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default React.memo(NavBar);
