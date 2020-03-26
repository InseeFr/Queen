import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import MenuIcon from './menu.icon';
import styles from './navigation.scss';

const Navigation = ({ components, bindings, setPage, viewedPages, setNavOpen }) => {
  const [open, setOpen] = useState(false);
  const [widthMenu, setWidthMenu] = useState('0');
  const [widthMenuBack, setWidthMenuBack] = useState('0');

  const handleClick = () => {
    console.log('opening menu...');
    if (open) {
      setWidthMenuBack('0');
      setNavOpen(false);
    } else {
      setNavOpen(true);
      setWidthMenu('20%');
      setWidthMenuBack('100%');
    }
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
        <button type="button" className="menu-icon" onClick={handleClick}>
          <MenuIcon width={30} />
        </button>
        <div className={'menu-container'}>
          <div className={open ? 'menu slideIn' : 'menu slideOut'} style={{ width: widthMenu }}>
            <nav>
              <ul>
                {components.map(comp => {
                  if (comp.componentType === 'Sequence') {
                    const refSequenceContent = React.createRef();
                    return (
                      <>
                        <div className="subnab">
                          <button
                            type="button"
                            key={comp.id}
                            className="subnav-btn"
                            onClick={() => console.log('hello')}
                          >
                            {getVtlLabel(comp.labelNav)}
                          </button>
                          <div className="subnav-content" ref={refSequenceContent}>
                            {components.map(comp2 => {
                              if (
                                comp2.componentType === 'Subsequence' &&
                                comp2.idSequence === comp.id
                              ) {
                                return (
                                  <div className="subnab">
                                    <button
                                      type="button"
                                      key={comp2.id}
                                      className="subnav-btn"
                                      onClick={() => console.log('hello')}
                                    >
                                      {getVtlLabel(comp2.labelNav)}
                                    </button>
                                  </div>
                                );
                              }
                              return null;
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
          <div className="background-menu" style={{ width: widthMenuBack }} onClick={handleClick} />
        </div>
      </div>
    </>
  );
};

Navigation.propTypes = {
  components: PropTypes.arrayOf(Object()).isRequired,
  setNavOpen: PropTypes.func.isRequired,
};

export default Navigation;
