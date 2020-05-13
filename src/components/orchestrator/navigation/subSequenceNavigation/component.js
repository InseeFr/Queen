import React, { useState, useCallback, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';

const SubsequenceNavigation = ({ sequence, close, setPage }) => {
  const [currentFocusSubsequenceIndex, setCurrentFocusSubsequenceIndex] = useState(-1);
  const [listRef] = useState(
    sequence.components ? sequence.components.reduce(_ => [..._, React.createRef()], []) : []
  );

  const backButtonRef = useRef(null);

  const setFocusSubsequence = useCallback(index => () => setCurrentFocusSubsequenceIndex(index));
  const lastIndexReachable = sequence.components.findIndex(({ reachable }) => !reachable) - 1;
  const lastIndexFocusable =
    lastIndexReachable >= -1 ? lastIndexReachable : sequence.components.length - 1;

  const setCurrentFocus = index => {
    if (lastIndexFocusable === -1 || index > lastIndexFocusable || index === -1)
      backButtonRef.current.focus();
    else if (index === -2) listRef[lastIndexFocusable].current.focus();
    else listRef[index].current.focus();
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
      setCurrentFocus(index + 1);
    }
    if (key === 'up') {
      setCurrentFocus(index - 1);
    }
  };

  const changePage = useCallback(
    ({ goToPage, reachable }) => () => {
      if (reachable) {
        setPage(goToPage);
      }
    },
    [setPage]
  );

  return (
    <div className="content">
      <button
        type="button"
        className="back-subnav-btn"
        autoFocus
        ref={backButtonRef}
        onFocus={setFocusSubsequence(-1)}
        onKeyDown={lastIndexFocusable === -1 ? handleFinalTab : null}
        onClick={close}
      >
        <span>{'\u3008'}</span>
        {D.goBackNavigation}
      </button>
      <nav role="navigation">
        <ul>
          {sequence.components.map((c, index) => {
            return (
              <div className="subnav" key={`subnav-${c.id}`}>
                <button
                  ref={listRef[index]}
                  autoFocus={c.reachable && index === 0}
                  type="button"
                  key={c.id}
                  className="subnav-btn"
                  disabled={!c.reachable}
                  onClick={changePage(c)}
                  onFocus={setFocusSubsequence(index)}
                  onKeyDown={index === lastIndexFocusable ? handleFinalTab : null}
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
