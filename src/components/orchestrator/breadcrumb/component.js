import React from 'react';
import PropTypes from 'prop-types';
import { StyleWrapper } from './component.style';

const BreadcrumbQueen = ({ sequence, subsequence, setPage }) => {
  const changePage = page => setPage(page);

  return (
    <StyleWrapper className={`Breadcrumb ${!subsequence ? 'sequence' : ''}`}>
      <div aria-label="breadcrumb" className="breadcrumb-queen">
        <button type="button" onClick={() => changePage(sequence.page)}>
          {sequence.label}
        </button>
        {subsequence && subsequence.label && (
          <button
            className="breadcrumb-element-queen"
            type="button"
            onClick={() => changePage(subsequence.page)}
          >
            {subsequence.label}
          </button>
        )}
      </div>
    </StyleWrapper>
  );
};

BreadcrumbQueen.propTypes = {
  sequence: PropTypes.shape({
    label: PropTypes.string,
    page: PropTypes.number,
  }).isRequired,
  subsequence: PropTypes.shape({
    label: PropTypes.string,
    page: PropTypes.number,
  }),
  setPage: PropTypes.func.isRequired,
};

BreadcrumbQueen.defaultProps = {
  subsequence: null,
};

export default React.memo(BreadcrumbQueen);
