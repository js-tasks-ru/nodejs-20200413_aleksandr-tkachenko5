const path = require('path');
const Koa = require('koa');
const app = new Koa();

const EventEmitter = require('events');
const emitter = new EventEmitter();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  /**
   * On the incoming request, create a new Promise and hold it.
   * Resolve the Promise only on the "newMessage" event,
   * with the message that was as a payload in the event.
   * */
  ctx.response.body = await new Promise((resolve) => {
    emitter.on('newMessage', (ctx) => {
      resolve(ctx.request.body.message);
    });
  });
  return next();
});

router.post('/publish', async (ctx, next) => {

  /**
   * Check if the message is not empty
   * */
  if (ctx.request.body.message) {
    /**
     * If the request is not empty:
     * Emmit the "newMessage" event with the "ctx" as a payload.
     * */
    emitter.emit('newMessage', ctx);
    ctx.response.body = 'Success';
    ctx.response;
    return next();
  } else {
    /**
     * If the request is empty.
     * */
    ctx.response.body = 'Empty message';
    return next();
  }
});

app.use(router.routes());


module.exports = app;
