import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { ProgressBar } from 'components/shared/ProgressBar';

const useStyles = makeStyles({
  current: { fontWeight: 'bold' },
});

export const SimpleLabelProgress = ({ value, label, current }) => {
  const classes = useStyles();
  return (
    <Box>
      {!!label && (
        <Typography className={current ? classes.current : ''}>{`${label} : `}</Typography>
      )}
      <ProgressBar value={value} />
    </Box>
  );
};
