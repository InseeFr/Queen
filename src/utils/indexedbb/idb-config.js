import Dexie from 'dexie';
import schema from './schema.json';
import schema2 from './schema2.json';

export class LocalDbFactory extends Dexie {
  constructor(dataBaseName) {
    super(dataBaseName);
    this.version(1).stores(schema);
    this.version(1).stores(schema2);
  }

  getStore(name) {
    const store = this[name];
    return store;
  }
}

export default new LocalDbFactory('Queen');
