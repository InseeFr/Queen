/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useCallback, useMemo } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import * as lunatic from '@inseefr/lunatic';
import { version } from '../../../../package.json';
import MenuIcon from './menu.icon';
import { StyleWrapper } from './component.style';
import SequenceNavigation from './sequenceNavigation';
import SubsequenceNavigation from './subSequenceNavigation';

const Navigation = ({ setMenuOpen, title, questionnaire, bindings, setPage, validatePages }) => {
  const [open, setOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [currentFocusItemIndex, setCurrentFocusItemIndex] = useState(-1);
  const [selectedSequence, setSelectedSequence] = useState(undefined);

  const getVtlLabel = label => {
    return lunatic.interpret(['VTL'])(bindings)(label);
  };

  const filterComponentsPage = questionnaire.components.reduce(
    (_, { componentType, conditionFilter, ...other }) => {
      if (
        !conditionFilter
          ? true
          : lunatic.interpret(['VTL'])(bindings, true)(conditionFilter) === 'normal'
      ) {
        if (componentType === 'Sequence') {
          const { page } = other;
          return [..._, page];
        }
        if (componentType === 'Subsequence') {
          const { goToPage } = other;
          return [..._, goToPage];
        }
      }

      return _;
    },
    []
  );

  const componentsVTL = questionnaire.components.reduce(
    (_, { componentType, labelNav, ...other }) => {
      if (componentType === 'Sequence') {
        const { page } = other;
        return [
          ..._,
          {
            componentType,
            labelNav: getVtlLabel(labelNav),
            reachable: validatePages.includes(page) && filterComponentsPage.includes(page),
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
            reachable: validatePages.includes(goToPage) && filterComponentsPage.includes(goToPage),
            ...other,
          },
        ];
      }
      return _;
    },
    []
  );

  const getSubsequenceComponents = useMemo(
    () => id =>
      componentsVTL.filter(
        ({ componentType, idSequence }) => componentType === 'Subsequence' && idSequence === id
      ),
    [componentsVTL]
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
  }, [surveyOpen, componentsVTL, getSubsequenceComponents]);

  const [listRef] = useState([React.createRef(), React.createRef()]);

  const openCloseSubMenu = useCallback(() => {
    if (surveyOpen) {
      setSelectedSequence(undefined);
      setSurveyOpen(false);
      listRef[1].current.focus();
    } else {
      setSurveyOpen(true);
    }
  }, [listRef, surveyOpen]);

  const openCloseMenu = useCallback(() => {
    if (surveyOpen) openCloseSubMenu();
    setOpen(!open);
    setMenuOpen(!open);
    listRef[0].current.focus();
  }, [surveyOpen, listRef, open, setMenuOpen, openCloseSubMenu]);

  const setNavigationPage = page => {
    openCloseMenu();
    setPage(page);
  };

  const setFocusItem = useCallback(index => () => setCurrentFocusItemIndex(index), [
    setCurrentFocusItemIndex,
  ]);

  const setCurrentFocus = index => {
    if (index === -1) listRef[listRef.length - 1].current.focus();
    else if (index === listRef.length) listRef[0].current.focus();
    else listRef[index].current.focus();
  };
  const getKeysToHandle = () => {
    if (open && !surveyOpen) return ['alt+b', 'esc', 'right', 'up', 'down'];
    if (open && surveyOpen) return ['left', 'alt+b'];
    return ['alt+b'];
  };
  const keysToHandle = getKeysToHandle();
  const keyboardShortcut = (key, e) => {
    e.preventDefault();
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
  const handleFinalTab = useCallback(
    e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        listRef[0].current.focus();
      }
    },
    [listRef]
  );

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
                <span className="go-to-navigation">{D.goToNavigation}</span>
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

const comparison = (prevProps, nextProps) => !nextProps.menuOpen;

Navigation.propTypes = {
  title: PropTypes.string.isRequired,
  bindings: PropTypes.objectOf(PropTypes.any).isRequired,
  questionnaire: PropTypes.objectOf(PropTypes.any).isRequired,
  setPage: PropTypes.func.isRequired,
  validatePages: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default React.memo(Navigation, comparison);
