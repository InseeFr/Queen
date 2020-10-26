const visualizeMessage = {
  visualizationTitlePage: {
    fr: 'Page de visualisation de questionnaire',
    en: 'Questionnaire preview page',
  },
  questionnaireUrl: { fr: 'URL du questionnaire', en: 'Questionnaire URL' },
  externalVariablesTitlePage: {
    fr: 'Variables externes',
    en: 'External variables',
  },
  visualizeInformations: {
    fr: n =>
      `Le questionnaire contient ${n} variable${n > 1 ? 's' : ''} externe${n > 1 ? 's' : ''}.`,
    en: n => `Le questionnaire contains ${n} external variable${n > 1 ? 's' : ''}.`,
  },
  visualizeInstructions: {
    fr: n => `Vous pouvez renseigner ${n > 1 ? 'leurs valeurs' : 'sa valeur'}.`,
    en: n => `You can fill in ${n > 1 ? 'their values' : 'its value'}.`,
  },
};

export default visualizeMessage;
