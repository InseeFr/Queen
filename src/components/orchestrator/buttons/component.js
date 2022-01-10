import React, { useContext, useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useStyles } from './component.style';
import { Button, IconButton } from 'components/designSystem';
import { PlayArrow, SkipNext } from '@material-ui/icons';
import { OrchestratorContext } from '../queen';

const skipNextIcon = <SkipNext fontSize="large" />;

const Buttons = ({ rereading, setPendingChangePage }) => {
  const { readonly, page, isFirstPage, isLastPage } = useContext(OrchestratorContext);

  const classes = useStyles();

  const previousButtonRef = useRef();
  const nextButtonRef = useRef();
  const fastNextButtonRef = useRef();
  const returnLabel = isFirstPage ? '' : D.goBackReturn;

  const keysToHandle = ['alt+enter', 'alt+backspace', 'alt+end'];

  const [focusPrevious, setFocusPrevious] = useState(false);
  const [focusNext, setFocusNext] = useState(false);
  const [focusFastForward, setFocusFastForward] = useState(false);

  const onfocusPrevious = value => () => setFocusPrevious(value);
  const onfocusNext = value => () => setFocusNext(value);
  const onfocusFastForward = value => () => setFocusFastForward(value);

  const [pageChanging, setPageChanging] = useState(false);

  const localPagePrevious = () => setPageChanging('previous');
  const localPageNext = () => setPageChanging('next');
  const localPageFastForward = () => setPageChanging('fastForward');

  useEffect(() => {
    setPageChanging(false);
  }, [page]);

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && ((!isLastPage && rereading) || readonly)) {
      if (nextButtonRef && nextButtonRef.current) {
        nextButtonRef.current.focus();
        localPageNext();
      }
    }
    if (key === 'alt+backspace' && !isFirstPage) {
      if (previousButtonRef && previousButtonRef.current) {
        previousButtonRef.current.focus();
        localPagePrevious();
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
    if ((focusNext || focusFastForward || focusPrevious) && pageChanging) {
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
              onClick={localPagePrevious}
              onFocus={onfocusPrevious(true)}
              onBlur={onfocusPrevious(false)}
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
              onClick={localPageNext}
              onFocus={onfocusNext(true)}
              onBlur={onfocusNext(false)}
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
