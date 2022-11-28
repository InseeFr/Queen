import Buttons from '../buttons';
import React from 'react';
import RightNavbar from '../rightNavbar';

const NavBar = ({ page, maxPages, rereading, setPendingChangePage }) => (
  <RightNavbar page={page} maxPages={maxPages}>
    <Buttons
      rereading={rereading}
      setPendingChangePage={setPendingChangePage}
      readonly
      page
      isFirstPage
      isLastPage
    />
  </RightNavbar>
);

export default NavBar;
