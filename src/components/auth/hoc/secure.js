import React, { useContext } from 'react';
// eslint-disable-next-line import/no-unresolved
import { OidcSecure } from '@axa-fr/react-oidc-context';
import { NONE, OIDC } from 'utils/constants';
import { AppContext } from 'components/app';

const secure = WrappedComponent => {
  return props => {
    const { authenticationType, online } = useContext(AppContext);

    const { otherProps } = props;
    const ReturnedComponent = <WrappedComponent {...otherProps} />;
    if (!online || authenticationType === NONE) return ReturnedComponent;
    if (authenticationType === OIDC) return <OidcSecure>{ReturnedComponent}</OidcSecure>;
    return <div>{`Auth type ${authenticationType} is nor recognized`}</div>;
  };
};

export default secure;
