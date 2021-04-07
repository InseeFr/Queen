import React from 'react';
import * as UQ from 'utils/questionnaire';
import { useStyles } from './component.style';

const NavBar = ({ maxPages, page, children, occurences }) => {
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
            <>
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
              <div key={`${localScopePage}-${i}`} className={classes.page}>
                <div className={classes.labelPage}>n° page</div>
                <div>
                  <b>{`${localScopePage}/${localScopeMaxPage}`}</b>
                </div>
              </div>
            </>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default React.memo(NavBar);
