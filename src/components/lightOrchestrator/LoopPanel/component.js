import { Panel } from './panel';
import { useStyles } from './component.style';

export const LoopPanel = ({ loopVariables = [], getData, pager, goToPage }) => {
  const classes = useStyles();
  if (loopVariables.length === 0 || loopVariables[0] === undefined) return null;

  const { page, subPage, lastReachedPage } = pager;
  console.log({ pager });

  // use page to select loopVariables depth
  const depth = 0;
  const targetVariable = loopVariables[depth];
  const datas = getData();
  const targetData = datas.COLLECTED[targetVariable];
  const { COLLECTED } = targetData;
  if (COLLECTED.length === 0 || COLLECTED[0] === null) return null;
  const isReached = iteration => {
    // if (page < maxPage) return true;
    // same page => check subPage
    // if (subPage < maxSubPage) return true;
    // same subPage => check iteration
    // lastReachedPage 19.2#3
    const maxIteration = parseInt(lastReachedPage.split('#')[1], 10);
    return iteration < maxIteration;
  };
  return (
    <div className={classes.loops}>
      {COLLECTED.map((value, index) => {
        return (
          <Panel
            key={`panel-${index}`}
            iterationValue={value?.toUpperCase() + `${page}.${subPage}#${index}` ?? ''}
            current={false}
            reachable={isReached(index)}
            onClick={() => {
              console.log('going to ', {
                page: page,
                iteration: index,
                subPage: subPage,
              });
              goToPage({
                page: page,
                iteration: index,
                subPage: subPage,
              });
            }}
          />
        );
      })}
      <button onClick={() => goToPage({ page: '32.0#1' })}>Go : 32.1#2</button>
    </div>
  );
};
