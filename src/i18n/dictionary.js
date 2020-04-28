import buttonMessage from './buttonMessage';
import navigationMessage from './navigationMessage';
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
  closeWindow: { fr: 'Vous pouvez fermer cette fenêtre', en: 'You can close this window.' },
  appInstalling: { fr: 'Installation, veuillez patientez...', en: 'Installation, please wait...' },
  updateAvailable: {
    fr:
      "Une nouvelle version de l'application est disponible et sera utilisée lorsque tous les onglets de cette page seront fermés.",
    en:
      'New version of the application is available and will be used when all tabs for this page are closed.',
  },
  appReadyOffline: {
    fr: "L'application est prête à être utilisée hors ligne.",
    en: 'The application is ready to be used offline.',
  },

  ...buttonMessage,
  ...navigationMessage,
  ...waitingMessage,
  ...errorMessage,
};

export default dictionary;
