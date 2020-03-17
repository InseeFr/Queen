import React, { useState } from 'react';
import * as lunatic from '@inseefr/lunatic';
import MenuIcon from './menu.icon';
import styles from './navigation.scss';

const Navigation = ({ components, bindings, setPage, viewedPages }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    console.log('opening menu...');
    setOpen(!open);
  };

  const getVtlLabel = label => {
    return lunatic.interpret(['VTL'])(bindings)(label);
  };

  const isCliquable = comp => {
    return viewedPages.includes(comp.page);
  };

  return (
    <>
      <style type="text/css">{styles}</style>
      <div className="navigation">
        <button className="menu-icon" onClick={handleClick}>
          <MenuIcon width={30} />
        </button>

        <div className="menu" hidden={!open}>
          <nav>
            <ul>
              {components.map((comp, index) => {
                if (comp.componentType === 'Sequence') {
                  const refSequenceContent = React.createRef();
                  return (
                    <>
                      <div className="subnab">
                        <button
                          key={index}
                          className="subnav-btn"
                          onClick={() => {
                            refSequenceContent.current.hidden = !refSequenceContent.current.hidden;
                          }}
                        >
                          {getVtlLabel(comp.label)} >
                        </button>
                        <div className="subnav-content" ref={refSequenceContent} hidden={true}>
                          {components.map((comp2, index2) => {
                            if (
                              comp2.componentType === 'Subsequence' &&
                              comp2.idSequence === comp.id
                            ) {
                              const refSubsequenceContent = React.createRef();
                              return (
                                <div className="subnab">
                                  <button
                                    key={index}
                                    className="subnav-btn"
                                    onClick={() => {
                                      refSubsequenceContent.current.hidden = !refSubsequenceContent
                                        .current.hidden;
                                    }}
                                  >
                                    {getVtlLabel(comp2.label)} >
                                  </button>

                                  <div
                                    className="subnav-content"
                                    ref={refSubsequenceContent}
                                    hidden={true}
                                  >
                                    {components.map((comp3, index3) => {
                                      if (
                                        comp3.componentType !== 'Sequence' &&
                                        comp3.componentType !== 'Subsequence'
                                      ) {
                                        if (comp3.idSubsequence === comp2.id) {
                                          return (
                                            <li>
                                              <a
                                                key={index3}
                                                onClick={
                                                  isCliquable(comp3)
                                                    ? () => {
                                                        setOpen(false);
                                                        setPage(comp3.page);
                                                      }
                                                    : null
                                                }
                                                className={isCliquable(comp3) ? 'active' : ''}
                                              >
                                                <b>{getVtlLabel(comp3.label)}</b>
                                              </a>
                                            </li>
                                          );
                                        }
                                      }
                                    })}
                                  </div>
                                </div>
                              );
                            } else if (
                              comp2.componentType !== 'Sequence' &&
                              comp2.componentType !== 'Subsequence'
                            ) {
                              if (!comp2.idSubsequence && comp2.idSequence === comp.id) {
                                return (
                                  <li>
                                    <a
                                      key={index2}
                                      onClick={
                                        isCliquable(comp2)
                                          ? () => {
                                              setOpen(false);
                                              setPage(comp2.page);
                                            }
                                          : null
                                      }
                                      className={isCliquable(comp2) ? 'active' : ''}
                                    >
                                      <b>
                                        PAGE : {comp2.page} {getVtlLabel(comp2.label)}
                                      </b>
                                    </a>
                                  </li>
                                );
                              }
                            }
                          })}
                        </div>
                      </div>
                    </>
                  );
                }
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navigation;
