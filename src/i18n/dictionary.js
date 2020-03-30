import buttonMessage from './buttonMessage';
import waitingMessage from './waitingMessage';
import errorMessage from './errorMessage';

const dictionary = {
  survey: {
    fr: 'Questionnaire',
    en: 'Survey',
  },
  pageNotFound: {
    fr: 'Page non trouvée',
    en: 'Page not found',
  },
  pageNotFoundHelp: {
    fr: "Veuillez vérifier l'URL",
    en: 'Please check the URL',
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
  ...errorMessage,
};

export default dictionary;
