import path from 'path';
import serve from 'koa-static';

const staticHandler = serve(path.resolve(__dirname, '..', '..', 'build'), {
  index: 'index.json',
  hidden: true,
  maxage: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
});

const middleware = () => async (ctx, next) => {
  if (ctx.request.path !== '/' && ctx.request.path !== 'index.html') {
    await staticHandler(ctx, next);
  } else {
    await next();
  }
};

export default middleware;
