import AbstractIdbService from './abstract-idb-service';

class SurveyUnitIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnit');
  }

  async addOrUpdateSU(item) {
    console.log(item);
    const { id, ...other } = item;
    console.log(id, typeof id);
    const surveyUnit = await this.getById(id);
    console.log(surveyUnit);
    /* prevent duplicated survey-unit */
    if (surveyUnit) {
      console.log('su found ', surveyUnit);
      return await this.update(item);
    }
    return await this.insert({ id: `${id}`, ...other });
  }
}

export default new SurveyUnitIdbService();
