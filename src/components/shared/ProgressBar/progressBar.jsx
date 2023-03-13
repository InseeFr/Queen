import React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const CustomProgressBar = withStyles(theme => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#47b52c',
  },
}))(LinearProgress);

export const ProgressBar = props => {
  const { value } = props;
  return (
    <Box display="flex" alignItems="center" component="div">
      <Box width="100%" mr={1} component="div">
        <CustomProgressBar variant="determinate" {...props} />
      </Box>
      <Box>
        <Typography variant="body2" noWrap color="textSecondary">{`${value} %`}</Typography>
      </Box>
    </Box>
  );
};

ProgressBar.defaultProps = {
  value: 0,
};

ProgressBar.propTypes = {
  value: PropTypes.number,
};
