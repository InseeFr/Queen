import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import * as lunatic from '@inseefr/lunatic';
import { version } from '../../../../package.json';
import MenuIcon from './menu.icon';
import styles from './navigation.scss';

const Navigation = ({ components, bindings, setPage, viewedPages, setNavOpen }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open) {
      setNavOpen(false);
    } else {
      setNavOpen(true);
    }
    setOpen(!open);
  };

  const getVtlLabel = label => {
    return lunatic.interpret(['VTL'])(bindings)(label);
  };

  const isCliquable = comp => {
    return viewedPages.includes(comp.page);
  };

  const keysToHandle = ['tab', 'esc'];
  const keyboardShortcut = (key, e) => {
    if (key === 'tab') {
      console.log(e);
      //if last item -> e.preventDefault() ou goTo button;
    }
    if (key === 'esc') setOpen(!open);
  };

  return (
    <>
      <style type="text/css">{styles}</style>
      <div className="header-item navigation">
        <button type="button" className="menu-icon" onClick={handleClick}>
          <MenuIcon width={48} color={open ? '#E30342' : '#000000'} />
        </button>
        <div className={`menu${open ? ' slideIn' : ''}`}>
          {open && (
            <div className="navigation-container">
              <span>{D.goToNavigation}</span>
              <nav role="navigation">
                <ul>
                  {components.map(comp => {
                    if (comp.componentType === 'Sequence') {
                      const refSequenceContent = React.createRef();
                      return (
                        <div className="subnav" key={`subnav-${comp.id}`}>
                          <button
                            type="button"
                            key={comp.id}
                            className="subnav-btn"
                            onClick={() => console.log('hello')}
                          >
                            {getVtlLabel(comp.labelNav)}
                          </button>
                          <div
                            className="subnav-content"
                            ref={refSequenceContent}
                            key={`subnav-content-${comp.id}`}
                          >
                            {components.map(comp2 => {
                              if (
                                comp2.componentType === 'Subsequence' &&
                                comp2.idSequence === comp.id
                              ) {
                                return (
                                  <li className="subnav" key={`subnav-${comp2.id}`}>
                                    <button
                                      type="button"
                                      key={comp2.id}
                                      className="subnav-btn"
                                      onClick={() => console.log('hello')}
                                    >
                                      {getVtlLabel(comp2.labelNav)}
                                    </button>
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    }
                  })}
                </ul>
              </nav>
              <span className="version">{`Version : ${version}`}</span>
            </div>
          )}
        </div>
        {open && <div className="background-menu" onClick={handleClick} />}
        {open && (
          <KeyboardEventHandler
            handleKeys={keysToHandle}
            onKeyEvent={keyboardShortcut}
            handleFocusableElements
          />
        )}
      </div>
    </>
  );
};

Navigation.propTypes = {
  components: PropTypes.arrayOf(PropTypes.any).isRequired,
  setNavOpen: PropTypes.func.isRequired,
};

export default Navigation;
