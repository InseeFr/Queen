import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useStyles } from './component.style';
import { getIterations } from 'utils/questionnaire';
import { OrchestratorContext } from '../queen';

const getNewPage = page => iterations => {
  if (page.includes('.')) {
    const [root, ...rest] = page.split('.');
    return `${root}.${rest.map((p, i) => `${p}#${iterations[i]}`).join('.')}`;
  }
  return page;
};

const hasToBlock = (prevProps, nextProps) => {
  const prevSubseqId = prevProps?.subsequence?.id;
  const prevSeqId = prevProps?.sequence?.id;
  const nextSubseqId = nextProps?.subsequence?.id;
  const nextSeqId = nextProps?.sequence?.id;
  const prevPage = prevProps?.currentPage;
  const nextPage = nextProps?.currentPage;
  return prevSeqId === nextSeqId && prevSubseqId === nextSubseqId && prevPage === nextPage;
};

const BreadcrumbQueen = ({ sequence, subsequence, currentPage }) => {
  const { setPage } = useContext(OrchestratorContext);
  const classes = useStyles({ sequence, subsequence });
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
          title={`${D.goToNavigation} ${sequence.label}`}
          onClick={() => changePage(sequence.page)}
        >
          {sequence.label}
        </button>
        {subsequence && subsequence.label && (
          <button
            className={`${classes.breadcrumbButton} ${classes.subsequenceButton}`}
            type="button"
            title={`${D.goToNavigation} ${subsequence.label}`}
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
};

BreadcrumbQueen.defaultProps = {
  subsequence: null,
};

export default React.memo(BreadcrumbQueen, hasToBlock);
