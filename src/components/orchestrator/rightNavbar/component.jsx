import React, { useContext } from 'react';
import * as UQ from 'utils/questionnaire';
import { OrchestratorContext } from '../queen';
import { useStyles } from './component.style';

const RightNavBar = ({ children }) => {
  const { page, maxPages, occurences } = useContext(OrchestratorContext);
  const classes = useStyles();

  const currentLocalPages = page.includes('.')
    ? UQ.getPageWithoutAnyIteration(page).split('.')
    : [page];

  const displayPages = currentLocalPages
    .map((p, i) => {
      return { localScopePage: p, localScopeMaxPage: maxPages[i] };
    })
    .reverse();

  const occurencesOrdered = occurences.slice().reverse();
  return (
    <div className={classes.root}>
      <div className={classes.pages}>
        {displayPages.map((pages, i) => {
          const { localScopePage, localScopeMaxPage } = pages;
          return (
            <React.Fragment key={`${localScopePage}-${i}`}>
              {occurencesOrdered && occurencesOrdered[i] && (
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
      </div>
      {children}
    </div>
  );
};

export default React.memo(RightNavBar);
