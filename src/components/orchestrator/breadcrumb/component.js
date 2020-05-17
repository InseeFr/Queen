import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from '@inseefr/lunatic';
import { StyleWrapper } from './component.style.js';

const BreadcrumbQueen = ({ sequence, subsequence }) => {
  return (
    <StyleWrapper className={`Breadcrumb ${!subsequence ? 'sequence' : ''}`}>
      <Breadcrumb elements={[sequence, subsequence]} />
    </StyleWrapper>
  );
};

BreadcrumbQueen.propTypes = {
  sequence: PropTypes.string.isRequired,
  subsequence: PropTypes.string,
};

BreadcrumbQueen.defaultProps = {
  subsequence: '',
};

export default BreadcrumbQueen;
