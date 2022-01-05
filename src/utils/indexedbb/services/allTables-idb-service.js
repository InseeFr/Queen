import Dexie from 'dexie';
import schema from '../schema.json';
import schema2 from '../schema2.json';

const clearAllTables = async () => {
  const db = new Dexie('Queen');
  db.version(1).stores(schema);
  db.version(2).stores(schema2);
  await db.open();
  await Promise.all(Object.keys(schema).map(table => db.table(table).clear()));
  await Promise.all(Object.keys(schema2).map(table => db.table(table).clear()));
  await db.close();
};

export default clearAllTables;
