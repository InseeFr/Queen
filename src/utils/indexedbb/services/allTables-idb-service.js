import Dexie from 'dexie';
import schema from '../schema.json';

const clearAllTables = async () => {
  const db = new Dexie('Queen');
  await db.delete();
  db.version(1).stores(schema);
  await db.open();
  await Promise.all(Object.keys(schema).map(table => db.table(table).clear()));
  await db.close();
};

export default clearAllTables;
