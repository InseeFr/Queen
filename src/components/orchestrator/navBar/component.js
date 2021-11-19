import React from 'react';
import RightNavBar from '../rightNavbar';
import Buttons from '../buttons';

const NavBar = ({ rereading, setPendingChangePage }) => (
  <RightNavBar>
    <Buttons rereading={rereading} setPendingChangePage={setPendingChangePage} />
  </RightNavBar>
);

export default NavBar;
