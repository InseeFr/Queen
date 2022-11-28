import { useEffect, useState } from 'react';

import { QUEEN_URL } from 'utils/constants';

export const useConfiguration = () => {
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    const loadConfiguration = async () => {
      const response = await fetch(`${QUEEN_URL}/configuration.json`);
      const configurationResponse = await response.json();
      configurationResponse.standalone = configurationResponse.queenUrl === window.location.origin;
      setConfiguration(configurationResponse);
    };
    loadConfiguration();
  }, []);

  return { configuration };
};
