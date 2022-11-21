/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState, useCallback, useEffect } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import '@a11y/focus-trap';
import { useStyles } from '../component.style';
import { ButtonItemMenu } from 'components/designSystem';
import {
  createArrayOfRef,
  createReachableElement,
  getNewFocusElementIndex,
  NEXT_FOCUS,
  PREVIOUS_FOCUS,
} from 'utils/navigation';

const SequenceNavigation = ({
  title,
  components,
  setPage,
  setSelectedSequence,
  subSequenceOpen,
  close,
}) => {
  const offset = 1;
  const [currentFocusElement, setCurrentFocusElement] = useState(undefined);
  const [currentFocusElementIndex, setCurrentFocusElementIndex] = useState(0);

  const [listRefs] = useState(
    components
      ? components.reduce(_ => [..._, React.createRef()], createArrayOfRef(offset))
      : createArrayOfRef(offset)
  );
  const reachableRefs = components.reduce((_, { reachable }) => {
    return [..._, reachable];
  }, createReachableElement(offset));

  useEffect(() => {
    if (!subSequenceOpen && currentFocusElementIndex >= 0) {
      listRefs[currentFocusElementIndex].current.focus();
      setCurrentFocusElement(undefined);
    }
  }, [subSequenceOpen, currentFocusElementIndex, listRefs]);

  const setFocus = useCallback(
    index => () => setCurrentFocusElementIndex(index),
    [setCurrentFocusElementIndex]
  );

  const openSubComponents = sequence => {
    if (sequence.components && sequence.components.length > 0) {
      if (!currentFocusElement || currentFocusElement !== sequence.id) {
        setSelectedSequence(sequence);
        setCurrentFocusElement(sequence.id);
      }
      if (currentFocusElement === sequence.id) {
        listRefs[0].current.focus();
        setSelectedSequence(undefined);
        setCurrentFocusElement(undefined);
      }
    } else if (sequence.reachable) {
      setPage(sequence.page);
    }
  };

  const open = sequence => () => openSubComponents(sequence);
  const closeMenu = () => close('sequence');

  const keysToHandle = subSequenceOpen ? ['left', 'esc'] : ['left', 'right', 'esc', 'up', 'down'];
  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    const indexOfSequence = currentFocusElementIndex - offset;
    if (key === 'right' && indexOfSequence >= 0) openSubComponents(components[indexOfSequence]);
    if (key === 'esc' || key === 'left') {
      if (!subSequenceOpen) closeMenu();
      else openSubComponents(components[indexOfSequence]);
    }
    if (key === 'down' || key === 'up') {
      const directionFocus = key === 'down' ? NEXT_FOCUS : PREVIOUS_FOCUS;
      const newRefIndex =
        getNewFocusElementIndex(directionFocus)(currentFocusElementIndex)(reachableRefs);
      listRefs[newRefIndex].current.focus();
    }
  };

  const classes = useStyles();

  return (
    <focus-trap>
      <div className="content">
        <ButtonItemMenu back autoFocus ref={listRefs[0]} onFocus={setFocus(0)} onClick={closeMenu}>
          <span>{'\u3008'}</span>
          {D.goBackNavigation}
        </ButtonItemMenu>
        <div>
          <div className={classes.title}>{title}</div>
          <nav role="navigation">
            <ul>
              {components.map((c, index) => {
                return (
                  <li key={c.id}>
                    <ButtonItemMenu
                      ref={listRefs[index + offset]}
                      autoFocus={index === 0}
                      selected={currentFocusElementIndex === index + offset}
                      disabled={!c.reachable}
                      onClick={open(c)}
                      onFocus={setFocus(index + offset)}
                    >
                      {c.labelNav}
                      <span>{`${c.components.length > 0 ? '\u3009' : ''} `}</span>
                    </ButtonItemMenu>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <KeyboardEventHandler
          handleKeys={keysToHandle}
          onKeyEvent={keyboardShortcut}
          handleFocusableElements
        />
      </div>
    </focus-trap>
  );
};

SequenceNavigation.propTypes = {
  title: PropTypes.string.isRequired,
  components: PropTypes.arrayOf(PropTypes.any).isRequired,
  setPage: PropTypes.func.isRequired,
  setSelectedSequence: PropTypes.func.isRequired,
  subSequenceOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default SequenceNavigation;
