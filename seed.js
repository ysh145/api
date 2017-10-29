// This script scans `ossur` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getOssurames, resolveOssurPath, mongoUri } from './config';

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  const Names = getOssurames();
  for (let name of Names) {
    console.log(`Starting seed '${name}'...`);
    if (fs.existsSync(resolveOssurPath(name, 'data'))) {
      const seedFile = resolveOssurPath(name, 'data/seed.js');
      try {
        fs.accessSync(seedFile, fs.F_OK);
        let seedFn = require(seedFile).default;
        await seedFn(db);
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          console.log(`  file '${seedFile}' not found. Skipping...`);
        } else {
          console.log(e);
        }
      }
    }
  }

  console.log('Seed competed!');
  db.close();
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
