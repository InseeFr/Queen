import React, { useState, useCallback, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';

const SubsequenceNavigation = ({ sequence, close, setPage }) => {
  const [currentFocusSubsequenceIndex, setCurrentFocusSubsequenceIndex] = useState(-1);
  const [listRef] = useState(
    sequence.components
      ? sequence.components.reduce(_ => [..._, React.createRef()], [React.createRef()])
      : [React.createRef()]
  );

  const backButtonRef = useRef(null);

  const setFocusSubsequence = useCallback(index => () => setCurrentFocusSubsequenceIndex(index), [
    setCurrentFocusSubsequenceIndex,
  ]);
  const reachableIndexes = sequence.components.reduce(
    (_, { reachable }, index) => {
      if (reachable) return [..._, index + 1];
      return _;
    },
    [0]
  );

  const lastIndexFocusable = reachableIndexes[reachableIndexes.length - 1];

  const setCurrentFocus = next => index => {
    const indexOfIndex = reachableIndexes.indexOf(index);
    if (next) {
      const nextIndex =
        indexOfIndex + 1 <= reachableIndexes.length - 1 ? reachableIndexes[indexOfIndex + 1] : -1;
      if (nextIndex >= 0) listRef[nextIndex].current.focus();
      else backButtonRef.current.focus();
    } else {
      const previousIndexTemp = indexOfIndex - 1;
      if (previousIndexTemp >= 0) listRef[reachableIndexes[previousIndexTemp]].current.focus();
      else if (previousIndexTemp === -1) backButtonRef.current.focus();
      else if (reachableIndexes.length > 0)
        listRef[reachableIndexes[reachableIndexes.length - 1]].current.focus();
      else backButtonRef.current.focus();
    }
  };

  const handleFinalTab = useCallback(e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      backButtonRef.current.focus();
    }
  }, []);

  const keysToHandle = ['up', 'down'];
  const keyboardShortcut = (key, e) => {
    const index = currentFocusSubsequenceIndex;
    if (key === 'down') {
      setCurrentFocus(true)(index);
    }
    if (key === 'up') {
      setCurrentFocus(false)(index);
    }
  };

  const changePage = useCallback(
    ({ page, goToPage, reachable }) => () => {
      if (reachable && goToPage) setPage(goToPage);
      else if (reachable && page) setPage(page);
    },
    [setPage]
  );

  return (
    <div className="content">
      <button
        type="button"
        className="back-subnav-btn"
        ref={backButtonRef}
        onFocus={setFocusSubsequence(-1)}
        onClick={close}
      >
        <span>{'\u3008'}</span>
        {D.goBackNavigation}
      </button>
      <button
        type="button"
        autoFocus
        className="subnav-btn"
        ref={listRef[0]}
        onClick={changePage(sequence)}
        onFocus={setFocusSubsequence(0)}
        onKeyDown={lastIndexFocusable === 0 ? handleFinalTab : null}
      >
        {sequence.labelNav}
      </button>
      <nav role="navigation">
        <ul>
          {sequence.components.map((c, index) => {
            return (
              <div className="subnav" key={`subnav-${c.id}`}>
                <button
                  ref={listRef[index + 1]}
                  type="button"
                  key={c.id}
                  className="subnav-btn"
                  disabled={!c.reachable}
                  onClick={changePage(c)}
                  onFocus={setFocusSubsequence(index + 1)}
                  onKeyDown={index + 1 === lastIndexFocusable ? handleFinalTab : null}
                >
                  {`${c.labelNav}`}
                </button>
              </div>
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
  );
};

SubsequenceNavigation.propTypes = {
  sequence: PropTypes.objectOf(PropTypes.any).isRequired,
  close: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default SubsequenceNavigation;
