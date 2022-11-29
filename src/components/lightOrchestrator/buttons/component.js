import { Button, IconButton } from 'components/designSystem';
import { PlayArrow, SkipNext } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';

import D from 'i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import { useStyles } from './component.style';

const skipNextIcon = <SkipNext fontSize="large" />;

const Buttons = ({
  rereading,
  setPendingChangePage,
  readonly,
  isFirstPage,
  isLastPage,
  goPrevious,
  goNext,
}) => {
  const classes = useStyles();

  const previousButtonRef = useRef();
  const nextButtonRef = useRef();
  const fastNextButtonRef = useRef();
  const returnLabel = isFirstPage ? '' : D.goBackReturn;

  const keysToHandle = ['alt+enter', 'alt+backspace', 'alt+end'];

  const [focusFastForward, setFocusFastForward] = useState(false);

  const onfocusFastForward = value => () => setFocusFastForward(value);

  const [pageChanging, setPageChanging] = useState(false);

  const localPageFastForward = () => setPageChanging('fastForward');

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && ((!isLastPage && rereading) || readonly)) {
      if (nextButtonRef && nextButtonRef.current) {
        nextButtonRef.current.focus();
        goNext();
      }
    }
    if (key === 'alt+backspace' && !isFirstPage) {
      if (previousButtonRef && previousButtonRef.current) {
        previousButtonRef.current.focus();
        goPrevious();
      }
    }
    if (key === 'alt+end' && !readonly && rereading && !isLastPage) {
      if (fastNextButtonRef && fastNextButtonRef.current) {
        fastNextButtonRef.current.focus();
        localPageFastForward();
      }
    }
  };

  useEffect(() => {
    if (focusFastForward && pageChanging) {
      setPendingChangePage(pageChanging);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageChanging, setPendingChangePage]);

  return (
    <>
      <div id="buttons" className={classes.root}>
        {returnLabel && (
          <div className={classes.navigation}>
            <IconButton
              ref={previousButtonRef}
              ariaLabel={D.goBackReturnLabel}
              className={classes.previousIcon}
              type="button"
              onClick={goPrevious}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
            <span className={classes.shortButtonSpan}>{D.goBackReturn}</span>
          </div>
        )}
        {((readonly && !isLastPage) || (!isLastPage && rereading)) && (
          <div className={`${classes.navigation} ${classes.nextButton}`}>
            <IconButton
              ref={nextButtonRef}
              ariaLabel={D.nextButtonLabel}
              type="button"
              onClick={goNext}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
            <span className={classes.shortButtonSpan}>{D.nextButton}</span>
          </div>
        )}
        {!readonly && rereading && !isLastPage && (
          <div className={`${classes.navigation} ${classes.fastButtonWrapper}`}>
            <Button
              ref={fastNextButtonRef}
              className={classes.fastButton}
              type="button"
              endIcon={skipNextIcon}
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
  rereading: PropTypes.bool.isRequired,
  setPendingChangePage: PropTypes.func.isRequired,
};

export default React.memo(Buttons);
