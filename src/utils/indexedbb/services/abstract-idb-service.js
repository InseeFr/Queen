import initIDB from '../idb-config';

export default class AbstractIdbService {
  constructor(store) {
    this.store = initIDB.getStore(store);
  }

  get(id) {
    return this.store.get({ id: `${id}` });
  }

  async getById(id) {
    return this.store.get(id);
  }

  getAll() {
    return this.store.toArray();
  }

  getAllSortedBy(indexedVariable) {
    return this.store.orderBy(indexedVariable).toArray();
  }

  insert(item) {
    return this.store.add(item);
  }

  update(item) {
    return this.store.put(item);
  }

  delete(id) {
    return this.store.delete(id);
  }

  deleteAll() {
    return this.store.clear();
  }

  async addOrUpdate(item) {
    if (item.id) {
      if ((await this.store.get(item.id)) === undefined) {
        return this.insert(item);
      }
      return this.update(item);
    }
    return 0;
  }

  addAll(items) {
    return this.store.bulkPut(items);
  }

  deleteByIds(ids) {
    return this.store.bulkDelete(ids);
  }
}
