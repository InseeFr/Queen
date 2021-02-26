import React, { useContext } from 'react';
// eslint-disable-next-line import/no-unresolved
import { OidcSecure } from '@axa-fr/react-oidc-context';
import { NONE, OIDC } from 'utils/constants';
import { AppContext } from 'components/app';

const secure = WrappedComponent => {
  const Component = props => {
    const { authenticationType } = useContext(AppContext);
    const { otherProps } = props;
    const ReturnedComponent = <WrappedComponent {...otherProps} />;
    if (authenticationType === NONE) return ReturnedComponent;
    if (authenticationType === OIDC) return <OidcSecure>{ReturnedComponent}</OidcSecure>;
    return <div>{`Auth type ${authenticationType} is nor recognized`}</div>;
  };
  return Component;
};

export default secure;
