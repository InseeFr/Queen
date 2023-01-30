import '@a11y/focus-trap';

import {
  NEXT_FOCUS,
  PREVIOUS_FOCUS,
  createArrayOfRef,
  createReachableElement,
  getNewFocusElementIndex,
} from 'utils/navigation';
import React, { useCallback, useState } from 'react';

import { ButtonItemMenu } from 'components/designSystem';
import D from 'i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import { isReachable } from 'utils/breadcrumb';

const SubsequenceNavigation = ({ sequence, close, setPage }) => {
  const offset = 2;
  const [currentFocusElementIndex, setCurrentFocusElementIndex] = useState(0);
  const [listRefs] = useState(
    sequence.children
      ? sequence.children.reduce(_ => [..._, React.createRef()], createArrayOfRef(offset))
      : createArrayOfRef(offset)
  );

  const setFocus = useCallback(
    index => () => setCurrentFocusElementIndex(index),
    [setCurrentFocusElementIndex]
  );
  const reachableRefs = sequence.children.reduce((_, current) => {
    return [..._, isReachable(current)];
  }, createReachableElement(offset));

  const keysToHandle = ['up', 'down'];
  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'down' || key === 'up') {
      const directionFocus = key === 'down' ? NEXT_FOCUS : PREVIOUS_FOCUS;
      const newRefIndex =
        getNewFocusElementIndex(directionFocus)(currentFocusElementIndex)(reachableRefs);
      listRefs[newRefIndex].current.focus();
    }
  };

  const changePage = useCallback(
    sequence => () => {
      const { page, goToPage } = sequence;
      const reachable = isReachable(sequence);
      if (reachable && goToPage) setPage(goToPage);
      else if (reachable && page) setPage(page);
    },
    [setPage]
  );

  return (
    <focus-trap>
      <div className="content">
        <ButtonItemMenu ref={listRefs[0]} back onFocus={setFocus(0)} onClick={close}>
          <span>{'\u3008'}</span>
          {D.goBackNavigation}
        </ButtonItemMenu>
        <ButtonItemMenu
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          ref={listRefs[1]}
          onClick={changePage(sequence)}
          onFocus={setFocus(1)}
        >
          {sequence.label}
        </ButtonItemMenu>
        <nav role="navigation">
          <ul>
            {sequence.children.map((c, index) => {
              const reachable = isReachable(c);
              return (
                <li key={c.lunaticId}>
                  <ButtonItemMenu
                    ref={listRefs[index + offset]}
                    disabled={!reachable}
                    onClick={changePage(c)}
                    onFocus={setFocus(index + offset)}
                  >
                    {`${c.label}`}
                  </ButtonItemMenu>
                </li>
              );
            })}
          </ul>
        </nav>
        <KeyboardEventHandler
          handleKeys={keysToHandle}
          onKeyEvent={keyboardShortcut}
          handleFocusableElements
        />
      </div>
    </focus-trap>
  );
};

SubsequenceNavigation.propTypes = {
  sequence: PropTypes.objectOf(PropTypes.any).isRequired,
  close: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default SubsequenceNavigation;
