/* @flow */

import path from 'path';
import fs from 'fs';


export const qosConfig = {
  appId: process.env.QOS_APP_ID || '1253923624',
  secretId: process.env.QOS_SECRET_ID || 'AKIDBOQPSLSi8MNenotFg7SgjbGnGoRTkeXH',
  secretKey: process.env.QOS_SECRET_KEY || 'hDYnqDTYUNJAqLp7JNFAuV0SkutgR1Qf',
  bucket: process.env.QOS_BUCKET || 'devcdn',
  region: process.env.QOS_REGION || 'tj'
}

export const expressPort = process.env.PORT || 3000;
export const imagePort = process.env.IMAGE_PORT || 3002;
// > use admin
// switched to db admin
// > db.createUser({user: 'ossur', pwd: 'ossur.2017', roles:[{role:'dbOwner',db:'ossur'},{role:'read', db:'local'}]})
export const mongoUri =
  // process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-compose-mongoose';
  process.env.MONGODB_URI || 'mongodb://mongo.mp.ossurchina.cn:27017/ossur';
export const ossurPath = './ossur';

export function getDirectories(srcPath: string): string[] {
  return fs
    .readdirSync(srcPath)
    .filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

export function resolveExamplePath(...args: any) {
  return path.resolve(ossurPath, ...args);
}

export function getExampleNames() {
  const preferableOrder = ['api'];
  const dirs = getDirectories(ossurPath);

  const result = [];
  preferableOrder.forEach(name => {
    const idx = dirs.indexOf(name);
    if (idx !== -1) {
      result.push(name);
      dirs.splice(idx, 1);
    }
  });
  dirs.forEach(name => {
    result.push(name);
  });

  return result;
}
