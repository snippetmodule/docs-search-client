import * as restify from 'restify';

import app from './app';
import config from './config';
//创建http server
let server: restify.Server = restify.createServer({
    name: 'docs-search_server'
});
server.use(restify.gzipResponse());//gzip压缩
server.use(restify.bodyParser());//将post请求的body数据转化到req.params
server.use(restify.queryParser());//将url？后的参数转化到req.params
// server.get(/\/docs\/public\/?.*/, restify.serveStatic({
//     directory: '../public'
// }));
//http服务器错误捕捉
// server.on('err', function (err) {
//     mongoose.disconnect(function (err) {
//         console.log('mongoose was disconnected');
//     });
//     console.log('server has a error, and stoped');
// });

//开始监听
server.listen(config.API_PORT, function () {
    console.log("%s listening at %s", server.name, server.url);
});
app(server);
