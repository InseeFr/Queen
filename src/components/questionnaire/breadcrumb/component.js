import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from '@inseefr/lunatic';
import styles from './breadcrumb.scss';

const BreadcrumbQueen = ({
  sequence = 'Default sequence',
  subsequence = 'Default subsequence',
}) => {
  return (
    <>
      <style type="text/css">{styles}</style>
      <div className={'Breadcrumb'}>
        <Breadcrumb elements={[sequence, subsequence]} />
      </div>
    </>
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
