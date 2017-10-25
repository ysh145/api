const qos = require('tan-qos-node-client').default;

import { qosConfig } from '../../../config';

function upload(tenant, to, from, cb) {
  const _config = {...qosConfig}    
  console.log("qos.config", _config);

  let client = qos.createClient(_config);

  client
    .upload({localFile: from, fileId: to})
    .then(res => {
      console.log('上传成功', res)
      cb(null, res.data)
    })
    .catch(err => {
      console.error('上传文件时报错', err)
      cb(err)
    })
}

exports.upload = upload

// 当文件名、文件内容相同时，重复上传返回相同的正确结果 当文件名相同、文件内容不同时，返回-177   { code: -177,     message:
// 'ERROR_CMD_COS_FILE_EXIST',    }   { access_url:
// 'http://bucket01-1253619459.file.myqcloud.com/dir/to/file.jpg.123124354354t545
// 4y7654yhtrhryh45y546',     resource_path:
// '/1253619459/bucket01/dir/to/file.jpg.123124354354t5454y7654yhtrhryh45y546',
//    source_url:
// 'http://bucket01-1253619459.cossh.myqcloud.com/dir/to/file.jpg.123124354354t54
// 54y7654yhtrhryh45y546',     url:
// 'http://sh.file.myqcloud.com/files/v2/1253619459/bucket01/dir/to/file.jpg.1231
// 24354354t5454y7654yhtrhryh45y546',     vid:
// '6cfd14acc58346f55e1d7ee099c762e51493497158' }   { access_url:
// 'http://bucket01-1253619459.file.myqcloud.com/dir/to/file.jpg',
// resource_path: '/1253619459/bucket01/dir/to/file.jpg',     source_url:
// 'http://bucket01-1253619459.cossh.myqcloud.com/dir/to/file.jpg',     url:
// 'http://sh.file.myqcloud.com/files/v2/1253619459/bucket01/dir/to/file.jpg',
//   vid: '03a625d456e35c77478c93cd4a0f99101493497213' }   { access_url:
// 'http://bucket01-1253619459.file.myqcloud.com/dir/to/dot.jpg',
// resource_path: '/1253619459/bucket01/dir/to/dot.jpg',     source_url:
// 'http://bucket01-1253619459.cossh.myqcloud.com/dir/to/dot.jpg',     url:
// 'http://sh.file.myqcloud.com/files/v2/1253619459/bucket01/dir/to/dot.jpg',
//  vid: 'c3ba384a6f07b445e97cdaf8002b74301493497772' }