import Dexie from 'dexie';
import schema from './schema.json';

export class LocalDbFactory extends Dexie {
  constructor(dataBaseName) {
    super(dataBaseName);
    this.version(1).stores(schema);
  }

  getStore(name) {
    const store = this[name];
    return store;
  }
}

export default new LocalDbFactory('Queen');
