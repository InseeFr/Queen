const errorMessage = {
  errorOccurred: { fr: 'Une erreur est survenue', en: 'An error has occurred' },
  failedToLoadSurveyUnit: {
    fr: "Impossible de charger l'unité enquêtée",
    en: 'Unable to load the survey unit',
  },
  questionnaireNotFound: {
    fr: 'Questionnaire introuvable',
    en: 'Questionnaire not found',
  },
  surveyUnitNotFound: {
    fr: 'Unité enquêtée introuvable',
    en: 'Survey unit not found',
  },
  putSurveyUnitFailed: {
    fr: "Échec lors de l'envoi des données",
    en: 'Failed to send data',
  },
  unauthorized: {
    fr: "Vous n'êtes pas autorisé à accéder à l'application",
    en: 'You are not authorized to access the application.',
  },
  getError401: {
    fr: 'Vous semblez avoir été déconnecté.',
    en: 'Changing the sequence',
  },
  getError403: {
    fr: type => {
      if (type === 'q') return `Vous n'êtes pas autorisé à accéder au questionnaire.`;
      if (type === 'm')
        return `Vous n'êtes pas autorisé à accéder aux métadonnées du questionnaire.`;
      if (type === 'd') return `Vous n'êtes pas autorisé à accéder aux données du répondant.`;
      return '';
    },
    en: type => {
      if (type === 'q') return `You are not authorized to access the questionnaire.`;
      if (type === 'm')
        return `You are not authorized to access the metadata of the questionnaire.`;
      if (type === 'd') return `You are not authorized to access the respondent's data.`;
      return '';
    },
  },
  getError404: {
    fr: type => {
      if (type === 'q') return `Le questionnaire n'existe pas.`;
      if (type === 'm') return `Les métadonnées du questionnaire n'existe pas.`;
      if (type === 'd') return `Il n'y a aucune donnée pour ce répondant.`;
      return '';
    },
    en: type => {
      if (type === 'q') return `The questionnaire does not exist.`;
      if (type === 'm') return `The metadata of the questionnaire does not exist.`;
      if (type === 'd') return `There is no data for this respondent.`;
      return '';
    },
  },
  getErrorServeur: {
    fr: `Il semble qu'il y ait une erreur côté serveur.`,
    en: `There seems to be an error on the server side.`,
  },
  getUnknownError: {
    fr: `Une erreur inconnue s'est produite, veuillez contacter l'assistance ou réessayer plus tard.`,
    en: `An unknown error occurred, please contact support or try again later.`,
  },
  noAuthFile: {
    fr: "Aucun fichier de configuration pour l'authentification n'a été trouvé (oidc.json ou keycloak.json).",
    en: 'No configuration file for authentication was found (oidc.json or keycloak.json).',
  },
};

export default errorMessage;
