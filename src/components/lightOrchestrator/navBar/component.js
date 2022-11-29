import Buttons from '../buttons';
import React from 'react';
import RightNavbar from '../rightNavbar';

const NavBar = ({
  page,
  maxPages,
  rereading,
  readonly,
  setPendingChangePage,
  isFirstPage,
  isLastPage,
  goPrevious,
  goNext,
}) => (
  <RightNavbar page={page} maxPages={maxPages}>
    <Buttons
      rereading={rereading}
      setPendingChangePage={setPendingChangePage}
      readonly={readonly}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      goPrevious={goPrevious}
      goNext={goNext}
    />
  </RightNavbar>
);

export default NavBar;
