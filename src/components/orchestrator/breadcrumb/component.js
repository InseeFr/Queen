import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './component.style';
import { getIterations } from 'utils/questionnaire';

const getNewPage = page => iterations => {
  if (page.includes('.')) {
    const [root, ...rest] = page.split('.');
    return `${root}.${rest.map((p, i) => `${p}#${iterations[i]}`).join('.')}`;
  }
  return page;
};

const BreadcrumbQueen = ({ sequence, subsequence, setPage, currentPage }) => {
  const classes = useStyles({ sequence, subsequence, setPage });
  const changePage = page => {
    const iterations = getIterations(currentPage);
    const newPage = getNewPage(page)(iterations);
    setPage(newPage);
  };

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
  currentPage: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
};

BreadcrumbQueen.defaultProps = {
  subsequence: null,
};

export default React.memo(BreadcrumbQueen);
