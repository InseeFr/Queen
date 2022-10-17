import buttonMessage from './buttonMessage';
import navigationMessage from './navigationMessage';
import waitingMessage from './waitingMessage';
import errorMessage from './errorMessage';
import visualizeMessage from './visualizeMessage';
import modalsMessage from './modalsMessage';

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
  closeWindow: {
    fr: 'Vous pouvez fermer cette fenêtre',
    en: 'You can close this window.',
  },
  appInstalling: {
    fr: 'Installation, veuillez patientez...',
    en: 'Installation, please wait...',
  },
  updateAvailable: {
    fr: "Une nouvelle version de l'application est disponible et sera utilisée lorsque tous les onglets de cette page seront fermés.",
    en: 'New version of the application is available and will be used when all tabs for this page are closed.',
  },
  updateInstalled: {
    fr: "L'application a été mise à jour avec succès",
    en: 'The application has been successfully updated',
  },
  updating: {
    fr: 'Mise à jour en cours',
    en: 'Update in progress',
  },
  installError: {
    fr: "Erreur lors de l'installation de l'application",
    en: 'Error during the installation of the application',
  },
  appReadyOffline: {
    fr: "L'application est prête à être utilisée hors ligne.",
    en: 'The application is ready to be used offline.',
  },
  syncPage: {
    fr: 'Page de synchronisation',
    en: 'Synchronization page',
  },
  manualSync: {
    fr: 'Synchronisation manuelle',
    en: 'Manual synchronization',
  },
  seeQuestionnaireExample: {
    fr: 'Voir un exemple de questionnaire',
    en: 'See a example of a questionnaire',
  },
  noDataCollected: { fr: 'Aucune donnée collectée', en: 'No data collected' },

  ...buttonMessage,
  ...navigationMessage,
  ...waitingMessage,
  ...errorMessage,
  ...visualizeMessage,
  ...modalsMessage,
};

export default dictionary;
