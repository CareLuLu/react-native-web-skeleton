import http from 'http';
import https from 'https';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import sslify from 'koa-sslify';
import auth from 'koa-basic-auth';
import config from './config';
import serve from './middleware/static';
import render from './middleware/renderer';

/* eslint no-console: 0 */

const app = new Koa();
const router = new KoaRouter();

const isHttps = () => true;

router.get('/(.*)', render());

app.use(sslify({ resolver: isHttps }));
app.use(helmet());
app.use(async (ctx, next) => {
  if (config.auth.username && config.auth.password) {
    await auth({
      name: config.auth.username,
      pass: config.auth.password,
    })(ctx, next);
  } else {
    await next();
  }
});
app.use(serve());
app.use(compress());
app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV !== 'test') {
  let server;
  const serverCallback = app.callback();
  if (config.api.https) {
    server = https.createServer(config.api.httpsOptions, serverCallback);
  } else {
    server = http.createServer(app.callback());
  }
  server.listen(config.api.port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      process.setMaxListeners(0);
      if (process.send) {
        process.send('ready');
      }
      console.info(`Koa 2 listening on port ${config.api.port}`);
    }
  });

  process.on('SIGINT', () => {
    server.close((err) => {
      process.exit(err ? 1 : 0);
    });
  });
}

export default app;
