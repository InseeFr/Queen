import Buttons from '../buttons';
import React from 'react';
import RightNavbar from '../rightNavbar';

const NavBar = ({
  page,
  maxPages,
  subPage,
  nbSubPages,
  iteration,
  nbIterations,
  rereading,
  readonly,
  isFirstPage,
  isLastPage,
  isLastReachedPage,
  goLastReachedPage,
  componentHasResponse,
  goPrevious,
  goNext,
}) => (
  <RightNavbar
    page={page}
    maxPages={maxPages}
    subPage={subPage}
    nbSubPages={nbSubPages}
    iteration={iteration}
    nbIterations={nbIterations}
  >
    <Buttons
      rereading={rereading}
      readonly={readonly}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      goPrevious={goPrevious}
      goNext={goNext}
      isLastReachedPage={isLastReachedPage}
      goLastReachedPage={goLastReachedPage}
      componentHasResponse={componentHasResponse}
    />
  </RightNavbar>
);

export default NavBar;
