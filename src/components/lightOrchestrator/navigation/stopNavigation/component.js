import React, { useState, useCallback } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import D from 'i18n';
import '@a11y/focus-trap';
import { ButtonItemMenu } from 'components/designSystem';
import {
  createArrayOfRef,
  createReachableElement,
  getNewFocusElementIndex,
  NEXT_FOCUS,
  PREVIOUS_FOCUS,
} from 'utils/navigation';
import { useStyles } from '../component.style';
import { StopModal } from 'components/shared/modals/stopModal';

const StopNavigation = React.forwardRef(({ close }, ref) => {
  const offset = 1;
  const labels = [
    {
      label: "Arrêt définitif de l'interview (refus, impossibilité de continuer, ...)",
      definitive: true,
    },
    {
      label: "Arrêt provisoire de l'interview",
      definitive: false,
    },
  ];

  const [currentFocusElementIndex, setCurrentFocusElementIndex] = useState(0);
  const [listRefs] = useState(
    labels.reduce(_ => [..._, React.createRef()], createArrayOfRef(offset))
  );
  const openModal = type => () => {
    setDefinitive(type);
    setOpen(true);
  };
  const closeMenu = () => close('stop');

  const setFocus = useCallback(
    index => () => setCurrentFocusElementIndex(index),
    [setCurrentFocusElementIndex]
  );
  const reachableRefs = labels.reduce(_ => [..._, true], createReachableElement(offset));

  const keysToHandle = ['left', 'right', 'esc', 'up', 'down'];
  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'right') openModal(labels[currentFocusElementIndex]);
    if (key === 'esc' || key === 'left') {
      if (!open) closeMenu();
    }
    if (key === 'down' || key === 'up') {
      const directionFocus = key === 'down' ? NEXT_FOCUS : PREVIOUS_FOCUS;
      const newRefIndex =
        getNewFocusElementIndex(directionFocus)(currentFocusElementIndex)(reachableRefs);
      listRefs[newRefIndex].current.focus();
    }
  };
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [definitive, setDefinitive] = useState(false);

  return (
    <focus-trap>
      <div className="content">
        <ButtonItemMenu ref={listRefs[0]} back onFocus={setFocus(0)} onClick={closeMenu}>
          <span>{'\u3008'}</span>
          {D.goBackNavigation}
        </ButtonItemMenu>
        <div>
          <div className={classes.title}>{"Quelle est la nature de l'arrêt ?"}</div>
          <nav role="navigation">
            <ul>
              {labels.map(({ label, definitive: menuDefinitive }, index) => {
                return (
                  <li key={label}>
                    <ButtonItemMenu
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus={index === 0}
                      ref={listRefs[index + offset]}
                      onClick={openModal(menuDefinitive)}
                      onFocus={setFocus(index + offset)}
                    >
                      {`${index + 1}. ${label}`}
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
      <StopModal ref={ref} open={open} setOpen={setOpen} definitive={definitive} />
    </focus-trap>
  );
});

export default StopNavigation;
