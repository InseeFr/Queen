import AbstractIdbService from './abstract-idb-service';

class SurveyUnitIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnit');
  }

  async addOrUpdateSU(item) {
    const { id, ...other } = item;
    const surveyUnit = await this.get(id);
    /* prevent duplicated survey-unit */
    if (surveyUnit) {
      return this.update(item);
    }
    return this.insert({ id: `${id}`, ...other });
  }
}

export default new SurveyUnitIdbService();
