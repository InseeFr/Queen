import React, { useState, useCallback, useRef, useMemo } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import * as lunatic from '@inseefr/lunatic';
import * as UQ from 'utils/questionnaire';
import { version } from '../../../../package.json';
import MenuIcon from './menu.icon';
import { StyleWrapper } from './component.style';
import SequenceNavigation from './sequenceNavigation';
import SubsequenceNavigation from './subSequenceNavigation';

const Navigation = ({ title, components, bindings, setPage }) => {
  const [open, setOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [currentFocusItemIndex, setCurrentFocusItemIndex] = useState(-1);
  const [selectedSequence, setSelectedSequence] = useState(undefined);

  const getVtlLabel = label => {
    return lunatic.interpret(['VTL'])(bindings)(label);
  };

  const lastPossiblePage = useMemo(() => {
    return surveyOpen
      ? UQ.getFastForwardPage(components.filter(({ filtered }) => !filtered))(null)
      : null;
  }, [surveyOpen]);

  const componentsVTL = components.reduce((_, { componentType, labelNav, ...other }) => {
    if (componentType === 'Sequence') {
      const { page } = other;
      return [
        ..._,
        {
          componentType,
          labelNav: getVtlLabel(labelNav),
          reachable: page <= lastPossiblePage,
          ...other,
        },
      ];
    }
    if (componentType === 'Subsequence') {
      const { goToPage } = other;
      return [
        ..._,
        {
          componentType,
          labelNav: getVtlLabel(labelNav),
          reachable: goToPage <= lastPossiblePage,
          ...other,
        },
      ];
    }
    return _;
  }, []);

  const getSubsequenceComponents = id =>
    componentsVTL.filter(
      ({ componentType, idSequence }) => componentType === 'Subsequence' && idSequence === id
    );

  const navigationComponents = useMemo(() => {
    return surveyOpen
      ? componentsVTL.reduce((_, { id, componentType, ...other }) => {
          if (componentType === 'Sequence') {
            return [
              ..._,
              {
                id,
                componentType,
                components: getSubsequenceComponents(id),
                ...other,
              },
            ];
          }
          return _;
        }, [])
      : null;
  }, [surveyOpen]);

  const [listRef] = useState([React.createRef(), React.createRef()]);

  const openCloseSubMenu = useCallback(() => {
    if (surveyOpen) {
      setSelectedSequence(undefined);
      setSurveyOpen(false);
      listRef[1].current.focus();
    } else {
      setSurveyOpen(true);
    }
  });

  const openCloseMenu = useCallback(() => {
    if (surveyOpen) openCloseSubMenu();
    setOpen(!open);
    listRef[0].current.focus();
  });

  const setNavigationPage = page => {
    setPage(page);
    openCloseMenu();
  };

  const setFocusItem = useCallback(index => () => setCurrentFocusItemIndex(index));

  const setCurrentFocus = index => {
    if (index === -1) listRef[listRef.length - 1].current.focus();
    else if (index === listRef.length) listRef[0].current.focus();
    else listRef[index].current.focus();
  };
  const keysToHandle =
    open && !surveyOpen ? ['alt+b', 'esc', 'right', 'up', 'down'] : ['left', 'alt+b'];
  const keyboardShortcut = (key, e) => {
    const index = currentFocusItemIndex;
    if (key === 'alt+b') {
      openCloseMenu();
    }
    if (key === 'esc' && !surveyOpen) openCloseMenu();
    if ((key === 'left' && !selectedSequence) || (key === 'esc' && surveyOpen)) openCloseSubMenu();
    if (key === 'right') {
      if (index === 1) openCloseSubMenu(true);
    }
    if (key === 'down') {
      setCurrentFocus(index + 1);
    }
    if (key === 'up') {
      setCurrentFocus(index - 1);
    }
  };
  const handleFinalTab = useCallback(e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      listRef[0].current.focus();
    }
  }, []);

  return (
    <>
      <StyleWrapper className="header-item navigation">
        <button
          ref={listRef[0]}
          type="button"
          className="menu-icon"
          onClick={openCloseMenu}
          onFocus={setFocusItem(0)}
        >
          <MenuIcon width={48} color={open ? '#E30342' : '#000000'} />
        </button>
        <div className={`menu${open ? ' slideIn' : ''}`}>
          {open && (
            <>
              <div className="navigation-container">
                <span>{D.goToNavigation}</span>
                <nav role="navigation">
                  <ul>
                    <button
                      type="button"
                      className={`subnav-btn ${currentFocusItemIndex === 1 ? 'selected' : ''}`}
                      ref={listRef[1]}
                      onFocus={setFocusItem(1)}
                      onClick={openCloseSubMenu}
                      onKeyDown={handleFinalTab}
                    >
                      {D.surveyNavigation}
                      <span>{'\u3009'}</span>
                    </button>
                  </ul>
                </nav>
              </div>
              <div className="version">{`Version ${version}`}</div>
            </>
          )}
        </div>
        {open && (
          <>
            <div className={`sequence-navigation-container${surveyOpen ? ' slideIn' : ''}`}>
              {surveyOpen && (
                <SequenceNavigation
                  title={title}
                  components={navigationComponents}
                  setPage={setNavigationPage}
                  setSelectedSequence={setSelectedSequence}
                  subSequenceOpen={!!selectedSequence}
                  close={openCloseSubMenu}
                />
              )}
            </div>
            {surveyOpen && (
              <div
                className={`subsequence-navigation-container${selectedSequence ? ' slideIn' : ''}`}
              >
                {selectedSequence && selectedSequence.components.length > 0 && (
                  <SubsequenceNavigation
                    sequence={selectedSequence}
                    close={() => setSelectedSequence(undefined)}
                    setPage={setNavigationPage}
                  />
                )}
              </div>
            )}
          </>
        )}

        {open && <div className="background-menu" onClick={openCloseMenu} />}

        <KeyboardEventHandler
          handleKeys={keysToHandle}
          onKeyEvent={keyboardShortcut}
          handleFocusableElements
        />
      </StyleWrapper>
    </>
  );
};

Navigation.propTypes = {
  title: PropTypes.string.isRequired,
  bindings: PropTypes.objectOf(PropTypes.any).isRequired,
  components: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Navigation;
