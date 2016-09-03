
import * as restify from 'restify';
// import * as devdocs from './crawler/devdocs.me';
import * as devdocsIO from './crawler/devdocs.io';
import * as docs from './routers/docs';

export default function app(server: restify.Server) {
  let path;
  // 爬取接口开始－－－－－－－－－－－
  // path = 'api/docs';
  // server.get(path + '/list?force=false', devdocs.getDocsList);
  // server.get(path + '/clearlist', devdocs.clearDocsList);
  // server.get(path + '/checklist', devdocs.checkDocsList);
  path = 'api/docs_io';
  server.get(path + '/list?force=false', devdocsIO.getDocsList);
  server.get(path + '/clearlist', devdocsIO.clearDocsList);
  server.get(path + '/checklist', devdocsIO.checkDocsList);
  // 爬取接口结束－－－－－－－－－－－
  path = 'docs'; 
  server.get(path, docs.getDocs);
  // server.get(path+'/:docType/:url(*)', docs.getDocs);
  server.get(path+'/:docType/:url1', docs.getDocsByUrl);
  server.get(path+'/:docType/:url1/:url2', docs.getDocsByUrl);
  server.get(path+'/:docType/:url1/:url2/:url3', docs.getDocsByUrl);
}