import React, { useEffect, useRef } from 'react';
import { Button } from 'components/designSystem/Button';
import D from 'i18n';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '@a11y/focus-trap';
import { IconButton, makeStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const StopModal = React.forwardRef(({ open, setOpen, definitive }, ref) => {
  const close = () => setOpen(false);

  const agree = () => {
    setOpen(false);
  };

  const definitiveStopLabel = definitive ? 'Arrêt définitif' : 'Arrêt provisoire';
  const definitiveStopDetails = definitive
    ? "Il est conseillé de renseigner un commentaire général sur le questionnaire avant de déclarer l'arrêt définitif."
    : 'Vous allez sortir du questionnaire';
  const validateLabel = definitive ? "Valider l'arrêt définitif" : 'Valider';
  const classes = useStyles();
  const agreeRef = useRef();

  const onEntered = () => {
    agreeRef.current.focus();
  };
  return (
    <Dialog
      open={open}
      onClose={close}
      disableEnforceFocus
      onEntered={onEntered}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      container={() => ref.current}
    >
      <focus-trap>
        <DialogTitle id="alert-dialog-slide-title">
          {definitiveStopLabel}

          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <IconButton aria-label="close" className={classes.closeButton} onClick={close}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            {definitiveStopDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <Button onClick={agree} ref={agreeRef}>
            {validateLabel}
          </Button>
          <Button onClick={close}>{'Annuler'}</Button>
        </DialogActions>
      </focus-trap>
    </Dialog>
  );
});

export default StopModal;
