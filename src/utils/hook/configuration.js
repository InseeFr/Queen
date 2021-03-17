import { useState, useEffect } from 'react';
import { QUEEN_URL } from 'utils/constants';

export const useConfiguration = () => {
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    if (!configuration) {
      const loadConfiguration = async () => {
        const response = await fetch(`${QUEEN_URL}/configuration.json`);
        const configurationResponse = await response.json();
        configurationResponse.standalone =
          configurationResponse.queenUrl === window.location.origin;
        setConfiguration(configurationResponse);
      };
      loadConfiguration();
    }
  }, [configuration]);

  return { configuration };
};
