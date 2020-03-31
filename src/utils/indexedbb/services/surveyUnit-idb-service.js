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
    const { id, ...content } = item;
    if (surveyUnit) {
      return this.update({ id: surveyUnit.id, ...content });
    }
    return this.insert(item);
  }
}

export default new SurveyUnitIdbService();
