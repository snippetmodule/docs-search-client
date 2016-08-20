
import * as restify from 'restify';

import * as devdocs from './routers/devdocs.me';

export default function app(server: restify.Server) {
  let path = 'api/docs';

  server.get(path + '/list', devdocs.getDocsList);
}