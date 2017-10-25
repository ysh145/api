import path from 'path';
import fs from 'fs';

export const qosConfig = {
  appId: process.env.QOS_APP_ID || '1253923624',
  secretId: process.env.QOS_SECRET_ID || 'AKIDBOQPSLSi8MNenotFg7SgjbGnGoRTkeXH',
  secretKey: process.env.QOS_SECRET_KEY || 'hDYnqDTYUNJAqLp7JNFAuV0SkutgR1Qf',
  bucket: process.env.QOS_BUCKET || 'devcdn',
  region: process.env.QOS_REGION || 'tj'
}

export const expressPort = process.env.PORT || 3001;
export const imagePort = process.env.IMAGE_PORT || 3002;
// - MONGODB_URI="mongodb://dev:SDKdev.2017@mongo.app.shandianke.com.cn:27020/sdkdev"
// > use admin
// switched to db admin
// > db.createUser({user: 'root', pwd: 'ossur.china.123', roles:[{role:'dbOwner',db:'ossur'},{role:'read', db:'local'}]})
export const mongoUri = process.env.MONGODB_URI || 'mongodb://root:ossur.china.123@mongo.mp.ossurchina.cn:27017/ossur';
export const examplesPath = './examples';

export function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

export function resolveExamplePath(...args) {
  return path.resolve(examplesPath, ...args);
}

export function getExampleNames() {
  const preferableOrder = ['customer'];
  const dirs = getDirectories(examplesPath);

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
