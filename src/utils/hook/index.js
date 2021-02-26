import { useLocation } from 'react-router-dom';

export * from './auth';
export * from './api';
export * from './serviceWorker';
export * from './configuration';

export const useVisuQuery = () => {
  const searchUrl = new URLSearchParams(useLocation().search);
  const questionnaireUrl = searchUrl.get('questionnaire');
  const dataUrl = searchUrl.get('data');
  return { questionnaireUrl, dataUrl };
};
