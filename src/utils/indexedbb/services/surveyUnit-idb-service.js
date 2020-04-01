import AbstractIdbService from './abstract-idb-service';

class SurveyUnitIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnit');
  }

  getByIdSU(idSU) {
    return this.store
      .where('idSU')
      .equals(idSU)
      .first();
  }

  async addOrUpdateSU(item) {
    const surveyUnit = await this.getByIdSU(item.idSU);
    /* prevent duplicated survey-unit */
    if (surveyUnit) {
      return this.update({ ...item, id: surveyUnit.id });
    }
    return this.insert(item);
  }
}

export default new SurveyUnitIdbService();
