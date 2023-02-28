import { Panel } from './panel';
import { useStyles } from './component.style';

export const LoopPanel = ({ loopVariables = [], getData, pager, goToPage }) => {
  const classes = useStyles();
  if (loopVariables.length === 0 || loopVariables[0] === undefined) return null;

  const {
    page: currentPage,
    subPage: currentSubPage,
    iteration: currentIteration,
    lastReachedPage,
  } = pager;

  // use page to select loopVariables depth
  const depth = 0;
  const targetVariable = loopVariables[depth];
  const datas = getData();
  const targetData = datas.COLLECTED[targetVariable];
  const { COLLECTED } = targetData;
  if (COLLECTED.length === 0 || COLLECTED[0] === null) return null;

  // get max page/subPage/iteration from lastReachedPage :
  // handle subPage/iteration starting from 1 in lastReachedPage while starting from 0 in pager
  const maxPage = parseInt(lastReachedPage.split('.')[0], 10);
  const maxSubPage = parseInt(lastReachedPage.split('.')[1], 10) - 1;
  const maxIteration = parseInt(lastReachedPage.split('#')[1], 10) - 1;
  const isReached = iteration => {
    if (currentPage < maxPage) return true;
    // same page => check subPage
    if (currentSubPage < maxSubPage) return true;
    // same subPage => check iteration
    return iteration < maxIteration;
  };
  return (
    <div className={classes.loops}>
      {COLLECTED.map((value, index) => {
        return (
          <Panel
            key={`panel-${index}`}
            value={value?.toUpperCase() ?? ''}
            current={currentIteration === index}
            reachable={isReached(index)}
            onClick={() =>
              goToPage({
                page: currentPage,
                iteration: index,
                subPage: currentSubPage,
              })
            }
          />
        );
      })}
    </div>
  );
};
