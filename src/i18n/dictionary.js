import buttonMessage from './buttonMessage';
import waitingMessage from './waitingMessage';

const dictionary = {
  survey: {
    fr: 'Questionnaire',
    en: 'Survey',
  },
  pageNotFound: {
    fr: 'Page non trouvée',
    en: 'Page not found',
  },
  example: {
    fr: 'Exemple :',
    en: 'Example:',
  },
  menuTitle: { fr: 'Menu :', en: 'Menu:' },
  backToBook: {
    fr: 'Retour au carnet de tournée',
    en: 'Back to circuit book',
  },
  ...buttonMessage,
  ...waitingMessage,
};

export default dictionary;
