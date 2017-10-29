/* @flow */
/* eslint-disable no-await-in-loop */
// This script scans `ossur` folder for `data/seed.js` files and run them for seeding DB.

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { getOssurNames, resolveOssurPath, mongoUri } from '../config';

let db;
async function run() {
  db = await MongoClient.connect(mongoUri, { promiseLibrary: Promise });

  const Names = getOssurNames();
  for (const name of Names) {
    console.log(`Starting seed '${name}'...`);

    const seedFile = resolveOssurPath(name, 'data/seed.js');
    try {
      await new Promise((resolve, reject) => {
        fs.access(seedFile, fs.F_OK, err => {
          if (err) reject(err);
          else resolve();
        });
      });

      // $FlowFixMe
      const seedFn = require(seedFile).default;
      await seedFn(db); // eslint-disable-line
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') {
        console.log(`  file '${seedFile}' not found. Skipping...`);
      } else {
        console.log(e);
      }
    }
  }

  console.log('Seed competed!');
  db.close();
}

run().catch(e => {
  console.log(e);
  process.exit(0);
});
