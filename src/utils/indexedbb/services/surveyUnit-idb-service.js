import AbstractIdbService from './abstract-idb-service';

class SurveyUnitIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnit');
  }

  async addOrUpdateSU(item) {
    const { id, ...other } = item;
    const surveyUnit = await this.getById(id);
    /* prevent duplicated survey-unit */
    if (surveyUnit) {
      return await this.update(item);
    }
    return await this.insert({ id: `${id}`, ...other });
  }
}

export default new SurveyUnitIdbService();
