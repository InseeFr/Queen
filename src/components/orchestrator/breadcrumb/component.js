import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './component.style';

const BreadcrumbQueen = ({ sequence, subsequence, setPage }) => {
  const classes = useStyles({ sequence, subsequence, setPage });
  const changePage = page => setPage(page);

  return (
    <div className={classes.root}>
      <div aria-label="breadcrumb">
        <button
          type="button"
          className={classes.breadcrumbButton}
          onClick={() => changePage(sequence.page)}
        >
          {sequence.label}
        </button>
        {subsequence && subsequence.label && (
          <button
            className={`${classes.breadcrumbButton} ${classes.subsequenceButton}`}
            type="button"
            onClick={() => changePage(subsequence.page)}
          >
            {subsequence.label}
          </button>
        )}
      </div>
    </div>
  );
};

BreadcrumbQueen.propTypes = {
  sequence: PropTypes.shape({
    label: PropTypes.string,
    page: PropTypes.string,
  }).isRequired,
  subsequence: PropTypes.shape({
    label: PropTypes.string,
    page: PropTypes.string,
  }),
  setPage: PropTypes.func.isRequired,
};

BreadcrumbQueen.defaultProps = {
  subsequence: null,
};

export default React.memo(BreadcrumbQueen);
