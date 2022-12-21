import { SHORTCUT_FAST_FORWARD, SHORTCUT_NEXT, SHORTCUT_PREVIOUS } from 'utils/constants';

import D from 'i18n';
import { IconButton } from 'components/designSystem';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PlayArrow } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { useStyles } from './component.style';

const Buttons = ({
  rereading,
  readonly,
  isFirstPage,
  isLastPage,
  goPrevious,
  goNext,
  componentHasResponse,
  isLastReachedPage,
  goLastReachedPage,
}) => {
  const classes = useStyles();

  const keysToHandle = [SHORTCUT_NEXT, SHORTCUT_PREVIOUS, SHORTCUT_FAST_FORWARD];

  const localPageFastForward = () => goLastReachedPage();
  const canGoNext = !isLastPage && (readonly || rereading || componentHasResponse);

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === SHORTCUT_NEXT && canGoNext) {
      goNext();
    }
    if (key === SHORTCUT_PREVIOUS && !isFirstPage) {
      goPrevious();
    }
    if (key === SHORTCUT_FAST_FORWARD && !readonly && rereading && !isLastPage) {
      localPageFastForward();
    }
  };
  return (
    <>
      <div id="buttons" className={classes.root}>
        <div className={classes.navigation}>
          <IconButton
            ariaLabel={D.goBackReturnLabel}
            className={classes.previousIcon}
            type="button"
            disabled={isFirstPage}
            onClick={goPrevious}
          >
            <PlayArrow fontSize="small" />
          </IconButton>
          <span className={classes.shortButtonSpan}>{D.goBackReturn}</span>
        </div>

        <div className={`${classes.navigation}`}>
          <IconButton
            ariaLabel={D.nextButtonLabel}
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
          >
            <PlayArrow fontSize="small" />
          </IconButton>
          <span className={classes.shortButtonSpan}>{D.nextButton}</span>
        </div>
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
};

export default React.memo(Buttons);
