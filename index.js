
import express from 'express';
// import cors from 'cors';
import graphqlHTTP from 'express-graphql';

import body_parser from'body-parser';
import multer      from'multer';
import sizeOf      from'image-size';
import shortid     from'shortid'
import {upload}    from'./ossur/api/utils/qos';

import { mainPage, addToMainPage } from './mainPage';
import { expressPort, imagePort, getOssurNames, resolveOssurPath } from './config';
import './mongooseConnection';

const uploaded = multer({limits:{ fileSize: 1024* 1024 * 100 }, storage: multer.memoryStorage()})      // { dest: '_uploaded/' }
const server = express();
// server.use(cors());


server.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200) //让options请求快速返回
  }
  else {
    next()
  }
})


// scan `ossur` directory and add
// - graphql endpoint by uri /ossurDirName
// - links and ossur queries to index page
const Names = getOssurNames();
for (let name of Names) {
  addOssur(
    require(resolveOssurPath(name)).default,
    name
  );
}

server.get('/', (req, res) => {
  res.send(mainPage());
});


server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});


function addOssur(ossur, uri) {
  ossur.uri = `/${uri}`;
  server.use(ossur.uri, graphqlHTTP(req => ({
    schema: ossur.schema,
    graphiql: true,
    formatError: (error) => ({
      message: error.message,
      stack: !error.message.match(/for security reason/i) ? error.stack.split('\n') : null,
    }),
  })));
  addToMainPage(ossur);
}

const app = express()

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200) //让options请求快速返回
  }
  else {
    next()
  }
})

//POST, req.headers['content-type'] can be application/json, text/plain, or application/x-www-form-urlencoded
app.use(body_parser.json())
app.use(body_parser.text())
app.use(function (req, res, next) {
  if (typeof req.body === 'string') req.body = JSON.parse(req.body)
  next()
})
app.use(body_parser.urlencoded({extended: false}))


//for testing
app.use(function (req, res, next) {
  //if (req.body.query) console.log(47, JSON.stringify(req.body.query))    // .slice(0,120)
  //if (req.body.variables) console.log(48, JSON.stringify(req.body.variables))
  next()
})

app.get('/file/:tenant/:id', function(req, res) {
  get(req.params.tenant, req.params.id, function(err,result){
    if (err){
      res.status(500).json({code:500,error:err})
    }
    else{
      let data= result
      res.json({code:0,data})
    }
  })
})

app.post('/file/:tenant', uploaded.single('file'), function(req, res) {
  console.log("req.file", req.file);
  let size = 0
  let width = 0
  let height = 0
  if (req.file.mimetype === 'image/gif' || req.file.mimetype === 'image/jpeg'  || req.file.mimetype === 'image/png' ){
    size = sizeOf(req.file.buffer); 
    width = size.width
    height = size.height
  }
  
  let id = shortid.generate()

  upload(`${req.params.tenant}`, `/${req.params.tenant}/${id}`, req.file.buffer, function(err,qosResponse){
    if (err){
      res.status(500).json({code:500,error:err})
    }
    else{
      let data= {id,...qosResponse,width,height,size}
      res.json({data})
    }
  })
})

app.listen(imagePort, () => {
  console.log(`The image server is running at http://localhost:${imagePort}/`);
});
