import { ArrowRightAlt, SkipNext } from '@material-ui/icons';

import { Button } from 'components/designSystem';
import D from 'i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import React from 'react';
import { SHORTCUT_FAST_FORWARD } from 'utils/constants';
import { useStyles } from './continue.style';

// import { SIMPLE_CLICK_EVENT, paradataHandler } from 'utils/events';

const ButtonContinue = ({
  goToLastReachedPage,
  quit,
  readonly,
  goNext,
  rereading,
  isLastReachedPage,
  componentHasResponse,
  isLastPage,
  page,
}) => {
  const classes = useStyles();
  const localPageFastForward = () => goToLastReachedPage();

  const shouldFastForward = !readonly && rereading && !isLastReachedPage;
  const shouldQuit = isLastPage && readonly;
  const shouldSaveAndQuit = isLastPage && !readonly;
  const shouldContinue = !shouldFastForward && componentHasResponse && !rereading;

  // à voir si on garde tous les events simples ou si on garde que le dernier pour le temps de passation partielle
  // const utilInfo = type => {
  //   return {
  //     ...SIMPLE_CLICK_EVENT,
  //     idParadataObject: `${type}-button`,
  //     page: page,
  //   };
  // };

  const localPageNext = () => goNext();

  const localFinalQuit = () => quit();

  const pageNextFunction = isLastPage ? localFinalQuit : localPageNext;
  // ? paradataHandler(localFinalQuit)(utilInfo('end-survey'))
  // : paradataHandler(localPageNext)(utilInfo('next-button'));

  const keysToHandle = [SHORTCUT_FAST_FORWARD];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === SHORTCUT_FAST_FORWARD) localPageFastForward();
  };

  const geLabelToDisplay = () => {
    if (shouldFastForward) return D.fastForward;
    if (shouldQuit) return D.simpleQuit;
    if (shouldSaveAndQuit) return D.saveAndQuit;
    return D.continueButton;
  };
  const labelToDisplay = geLabelToDisplay();

  const getEndIconToDisplay = () => {
    if (shouldFastForward) return <SkipNext fontSize="large" />;
    if (shouldContinue) return <ArrowRightAlt />;
    return undefined;
  };
  const endIconToDisplay = getEndIconToDisplay();

  const onClickFunction = () => {
    if (shouldFastForward) return goToLastReachedPage;
    if (shouldContinue) return pageNextFunction;
  };

  const helpLabel = shouldFastForward ? D.ctrlEnd : D.ctrlEnter;

  const componentToDisplay = (
    <div className={classes.wrapperButton}>
      <Button
        aria-label={labelToDisplay}
        type="button"
        onClick={onClickFunction()}
        endIcon={endIconToDisplay}
      >
        {labelToDisplay}
      </Button>
      <span className={classes.help}>{` ${D.helpShortCut} `}</span>
      <span className={classes.labelHelp}>{helpLabel}</span>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </div>
  );
  const emptyComponent = <div className={classes.wrapperButton} />;

  const shouldDisplay = shouldFastForward || shouldQuit || shouldSaveAndQuit || shouldContinue;
  return shouldDisplay ? componentToDisplay : emptyComponent;
};

ButtonContinue.propTypes = {
  quit: PropTypes.func.isRequired,
};

export default React.memo(ButtonContinue);
