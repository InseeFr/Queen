import AbstractIdbService from './abstract-idb-service';

class ParadataIdbService extends AbstractIdbService {
  constructor() {
    super('paradata');
  }
}

export default new ParadataIdbService();
