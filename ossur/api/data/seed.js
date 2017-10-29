import fs from 'fs';
// import { ObjectID } from 'mongodb';
let ObjectID = require('bson-objectid')

const collectionPrefix = '';

export default async function seed(db) {
  const files = [
    'products'
  ];

  const collectionNames = (await db.listCollections().toArray()).map(o => o.name);

  return await Promise.all(
    files.map((file) => {
      return (async function () {
        const colName = `${collectionPrefix || ''}${file}`;
        const data = JSON.parse(
          fs.readFileSync(`${__dirname}/${file}.json`, 'utf8')
        );
        data.forEach((d, i) => {
          // data[i]._id = new ObjectID.createFromHexString(data[i]._id)
          data[i]._id = ObjectID()
        });
        if (collectionNames.includes(colName)) {
          console.log(`  '${colName}' dropped`);
          await db.dropCollection(colName);
        }
        const result = await db.collection(colName).insertMany(data);
        console.log(`  '${colName}' created with ${result.insertedCount} records`, );
      })();
    })
  );
}
