import React, { useMemo } from 'react';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const StyleProvider = ({ children }) => {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#085394',
          },
          secondary: {
            main: '#FFFFFF',
          },
          declarations: {
            main: '#085394',
            help: 'black',
          },
          background: {
            default: '#eeeeee',
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 460,
            md: 750,
            lg: 875,
            xl: 1200,
          },
        },
      }),
    []
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default StyleProvider;
