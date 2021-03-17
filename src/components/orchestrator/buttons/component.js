import React, { useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useStyles } from './component.style';
import { Button, IconButton } from 'components/designSystem';
import { PlayArrow, SkipNext } from '@material-ui/icons';

const Buttons = ({
  readonly,
  rereading,
  page,
  canContinue,
  isLastComponent,
  pagePrevious,
  setPendingChangePage,
}) => {
  const classes = useStyles();

  const nextButtonRef = useRef();
  const fastNextButtonRef = useRef();
  const returnLabel = page === 0 ? '' : D.goBackReturn;

  const keysToHandle = ['alt+enter', 'alt+backspace', 'alt+end'];

  const [focusNext, setFocusNext] = useState(false);
  const [focusFastForward, setFocusFastForward] = useState(false);

  const onfocusNext = value => () => setFocusNext(value);
  const onfocusFastForward = value => () => setFocusFastForward(value);

  const [pageChanging, setPageChanging] = useState(false);

  const localPageNext = () => setPageChanging('next');
  const localPageFastForward = () => setPageChanging('fastForward');

  useEffect(() => {
    setPageChanging(false);
  }, [page]);

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && ((!isLastComponent && rereading && canContinue) || readonly)) {
      if (nextButtonRef && nextButtonRef.current) {
        nextButtonRef.current.focus();
        localPageNext();
      }
    }
    if (key === 'alt+backspace') pagePrevious();
    if (key === 'alt+end' && !readonly && rereading && !isLastComponent) {
      if (fastNextButtonRef && fastNextButtonRef.current) {
        fastNextButtonRef.current.focus();
        localPageFastForward('fastForward');
      }
    }
  };

  useEffect(() => {
    if ((focusNext || focusFastForward) && pageChanging) {
      setPendingChangePage(pageChanging);
    }
  }, [focusNext, focusFastForward, pageChanging, setPendingChangePage]);

  return (
    <>
      <div id="buttons" className={classes.root}>
        {returnLabel && (
          <div className={classes.navigation}>
            <IconButton
              ariaLabel={D.goBackReturnLabel}
              className={classes.previousIcon}
              type="button"
              onClick={pagePrevious}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
            <span className={classes.shortButtonSpan}>{D.goBackReturn}</span>
          </div>
        )}
        {((readonly && !isLastComponent) || (!isLastComponent && rereading)) && (
          <div className={`${classes.navigation} ${classes.nextButton}`}>
            <IconButton
              ref={nextButtonRef}
              ariaLabel={D.nextButtonLabel}
              type="button"
              onClick={localPageNext}
              onFocus={onfocusNext(true)}
              onBlur={onfocusNext(false)}
              disabled={!canContinue && !readonly}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
            <span className={classes.shortButtonSpan}>{D.nextButton}</span>
          </div>
        )}
        {!readonly && rereading && !isLastComponent && (
          <div className={`${classes.navigation} ${classes.fastButtonWrapper}`}>
            <Button
              ref={fastNextButtonRef}
              className={classes.fastButton}
              type="button"
              endIcon={<SkipNext fontSize="large" />}
              onClick={localPageFastForward}
              onFocus={onfocusFastForward(true)}
              onBlur={onfocusFastForward(false)}
            >
              {`${D.fastForward}`}
            </Button>
            <span className={classes.fastButtonSpan}>
              <b>{D.ctrlEnd}</b>
            </span>
          </div>
        )}
      </div>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </>
  );
};

Buttons.propTypes = {
  readonly: PropTypes.bool.isRequired,
  rereading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  pagePrevious: PropTypes.func.isRequired,
  setPendingChangePage: PropTypes.func.isRequired,
};

export default React.memo(Buttons);
