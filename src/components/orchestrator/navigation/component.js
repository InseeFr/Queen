/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import * as lunatic from '@inseefr/lunatic';
import { version } from '../../../../package.json';
import MenuIcon from './menu.icon';
import { useStyles } from './component.style';
import SequenceNavigation from './sequenceNavigation';
import SubsequenceNavigation from './subSequenceNavigation';
import '@a11y/focus-trap';
import { ButtonItemMenu } from 'components/designSystem';
import {
  createArrayOfRef,
  createReachableElement,
  getNewFocusElementIndex,
  NEXT_FOCUS,
  PREVIOUS_FOCUS,
} from 'utils/navigation';
import StopNavigation from './stopNavigation';

const Navigation = ({
  className,
  setMenuOpen,
  title,
  questionnaire,
  bindings,
  setPage,
  validatePages,
}) => {
  const [open, setOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [stopOpen, setStopOpen] = useState(false);
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

  const componentsVTL = questionnaire.components.reduce((_, { componentType, label, ...other }) => {
    if (componentType === 'Sequence') {
      const { page } = other;
      return [
        ..._,
        {
          componentType,
          labelNav: getVtlLabel(label),
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
          labelNav: getVtlLabel(label),
          reachable: validatePages.includes(goToPage) && filterComponentsPage.includes(goToPage),
          ...other,
        },
      ];
    }
    return _;
  }, []);

  const getSubsequenceComponents = useMemo(
    () => id =>
      componentsVTL.filter(
        ({
          componentType,
          hierarchy: {
            sequence: { id: idSequence },
          },
        }) => componentType === 'Subsequence' && idSequence === id
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
  const offset = 1;

  const menuItemsSurvey = [D.surveyNavigation, 'Boucle...'];
  const menuItemsQuality = ['Commentaire', 'Arrêt'];

  const [currentFocusElementIndex, setCurrentFocusElementIndex] = useState(0);
  const [listRefs] = useState(
    [...menuItemsSurvey, ...menuItemsQuality].reduce(
      _ => [..._, React.createRef()],
      createArrayOfRef(offset)
    )
  );

  const setFocus = useCallback(index => () => setCurrentFocusElementIndex(index), [
    setCurrentFocusElementIndex,
  ]);
  const reachableRefs = [...menuItemsSurvey, ...menuItemsQuality].reduce(
    _ => [..._, true],
    createReachableElement(offset)
  );

  const openCloseSubMenu = useCallback(
    type => {
      if (type === 'sequence') {
        setStopOpen(false);
        if (surveyOpen) {
          setSelectedSequence(undefined);
          setSurveyOpen(false);
          listRefs[1].current.focus();
        } else {
          setSurveyOpen(true);
        }
      } else if (type === 'stop') {
        setSurveyOpen(false);
        if (stopOpen) {
          setStopOpen(false);
          listRefs[4].current.focus();
        } else {
          setStopOpen(true);
        }
      }
    },
    [listRefs, stopOpen, surveyOpen]
  );

  const openCloseMenu = useCallback(() => {
    if (surveyOpen) openCloseSubMenu('sequence');
    if (stopOpen) openCloseSubMenu('stop');
    setOpen(!open);
    setMenuOpen(!open);
    listRefs[0].current.focus();
  }, [surveyOpen, openCloseSubMenu, stopOpen, open, setMenuOpen, listRefs]);

  const setNavigationPage = page => {
    openCloseMenu();
    setPage(page);
  };

  const getKeysToHandle = () => {
    if (open && (surveyOpen || stopOpen)) return ['alt+b'];
    if (open) return ['alt+b', 'esc', 'right', 'up', 'down'];
    return ['alt+b'];
  };
  const keysToHandle = getKeysToHandle();
  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+b') {
      openCloseMenu();
    }
    if (key === 'esc' && !surveyOpen) openCloseMenu();
    if (key === 'right') {
      if (currentFocusElementIndex === 1) openCloseSubMenu('sequence');
      if (currentFocusElementIndex === 4) openCloseSubMenu('stop');
    }
    if (key === 'down' || key === 'up') {
      const directionFocus = key === 'down' ? NEXT_FOCUS : PREVIOUS_FOCUS;
      const newRefIndex = getNewFocusElementIndex(directionFocus)(currentFocusElementIndex)(
        reachableRefs
      );
      listRefs[newRefIndex]?.current?.focus();
    }
  };
  const classes = useStyles();

  const [trapFocus, setTrapFocus] = useState(false);
  useEffect(() => {
    setTimeout(() => setTrapFocus(open), 250);
  }, [open]);

  const menu = (
    <>
      <button
        ref={listRefs[0]}
        type="button"
        className={classes.menuIcon}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onClick={openCloseMenu}
        onFocus={setFocus(0)}
      >
        <MenuIcon width={48} color={open ? '#E30342' : '#000000'} />
      </button>
      <div className={`${classes.menu}${open ? ' slideIn' : ''}`}>
        {open && (
          <>
            <div className={classes.navigationContainer}>
              <span className={classes.goToNavigationSpan}>{D.goToNavigation}</span>
              <nav role="navigation">
                <ul>
                  {menuItemsSurvey.map((label, index) => {
                    const type = index === 0 ? 'sequence' : '';
                    return (
                      <li key={label}>
                        <ButtonItemMenu
                          ref={listRefs[index + offset]}
                          selected={currentFocusElementIndex === index + offset}
                          onClick={() => openCloseSubMenu(type)}
                          onFocus={setFocus(index + offset)}
                        >
                          {label}
                          <span>{'\u3009'}</span>
                        </ButtonItemMenu>
                      </li>
                    );
                  })}
                  <li className={classes.itemTitle}>
                    <span>{'Qualité'}</span>
                  </li>
                  {menuItemsQuality.map((label, index) => {
                    const type = index === 0 ? 'comment' : 'stop';
                    return (
                      <li key={label}>
                        <ButtonItemMenu
                          ref={listRefs[index + menuItemsSurvey.length + offset]}
                          selected={
                            currentFocusElementIndex === index + menuItemsSurvey.length + offset
                          }
                          onClick={() => openCloseSubMenu(type)}
                          onFocus={setFocus(index + menuItemsSurvey.length + offset)}
                        >
                          {label}
                          <span>{'\u3009'}</span>
                        </ButtonItemMenu>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            <div className={classes.version}>{`Version ${version}`}</div>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className={className}>
      {trapFocus && <focus-trap>{menu}</focus-trap>}
      {!trapFocus && menu}
      {open && (
        <>
          <div
            className={`${classes.subMenuNavigationContainer} ${
              classes.sequenceNavigationContainer
            }${surveyOpen || stopOpen ? ' slideIn' : ''}`}
          >
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
            {stopOpen && <StopNavigation close={openCloseSubMenu} />}
          </div>
          {surveyOpen && (
            <div
              className={`${classes.subMenuNavigationContainer} ${
                classes.subsequenceNavigationContainer
              }${selectedSequence ? ' slideIn' : ''}`}
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

      {open && <div className={classes.backgroundMenu} onClick={openCloseMenu} />}

      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </div>
  );
};

const comparison = (prevProps, nextProps) => !nextProps.menuOpen;

Navigation.propTypes = {
  title: PropTypes.string.isRequired,
  bindings: PropTypes.objectOf(PropTypes.any).isRequired,
  questionnaire: PropTypes.objectOf(PropTypes.any).isRequired,
  setPage: PropTypes.func.isRequired,
  validatePages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(Navigation, comparison);
