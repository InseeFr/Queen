import React from 'react';
import { useStyles } from './component.style';

const RightNavBar = ({
  children,
  page,
  maxPages,
  occurences = [],
  subPage,
  nbSubPages,
  iteration,
  nbIterations,
}) => {
  const classes = useStyles();

  const displayPages = [
    [page, maxPages],
    [subPage, nbSubPages],
  ]
    .filter(([current]) => !!current)
    .map(([current, max]) => {
      return { localScopePage: current, localScopeMaxPage: max };
    })
    .reverse();
  // slice prevent from mutating original array
  const occurencesOrdered = occurences.slice().reverse();
  return (
    <div className={classes.root}>
      {displayPages.map((pages, i, init) => {
        const { localScopePage, localScopeMaxPage } = pages;
        return (
          <React.Fragment key={`${localScopePage}-${i}`}>
            {init.length > 1 && (
                <div className={classes.page}>
                  <div className={classes.labelPage}>Occurence</div>

                  <b key="occurence" className={classes.detail}>
                    Loop
                  </b>
                </div>
              ) &&
              occurencesOrdered &&
              occurencesOrdered[i] && (
                <div className={classes.page}>
                  <div className={classes.labelPage}>Occurence</div>
                  {occurencesOrdered[i].map((v, o) => {
                    return (
                      <b key={`${v}-${o}`} className={classes.detail}>
                        {v}
                      </b>
                    );
                  })}
                </div>
              )}
            <div className={classes.page}>
              <div className={classes.labelPage}>n° page</div>
              <div>
                <b>{`${localScopePage}/${localScopeMaxPage}`}</b>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {children}
    </div>
  );
};

export default React.memo(RightNavBar);
