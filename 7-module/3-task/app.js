const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const Session = require('./models/Session');
const uuid = require('uuid/v4');
const handleMongooseValidationError = require('./libs/validationErrors');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const {login} = require('./controllers/login');
const {oauth, oauthCallback} = require('./controllers/oauth');
const {me} = require('./controllers/me');

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

/**
 *  Executes with the user object.
 *  Return session token that will be created in the proccess of the function execution.
 * */
app.use((ctx, next) => {
  ctx.login = async function(user) {
    /**
     * Creating of the new session token.
     * */
    const token = uuid();

    /**
     * Creating of the new session.
     * @param: token
     * @param: Date object
     * @param: user._id
     * */
    const session = new Session({
      token,
      lastVisit: new Date(),
      user: user._id,
    });

    /**
     * Save the session.
     * */
    await session.save();

    return token;
  };

  return next();
});

const router = new Router({prefix: '/api'});

/**
 * Check for the session token.
 * */
router.use(async (ctx, next) => {
  /**
   * Check for the "Authorization" header.
   * If the header does not exist, call the next middleware.
   * */
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  /**
   * Split the token from the "Authorization" header.
   * If the token does not exist, call the next middleware.
   * */
  const bearerToken = header.split(' ')[1];
  if (!bearerToken) {
    return next();
  }

  /**
   * Searching the session related to the user token.
   * If the session does not exist, return the "401" error.
   * */
  const session = await Session.findOne({token: bearerToken}).populate('user');
  if (!session) {
    ctx.status = 401;
    ctx.body = {error: 'Неверный аутентификационный токен'};
    return;
  }

  /**
   * If the session is exist, update the last visit of the user,
   * and save the user object to the "ctx.user" property.
   * */
  session.lastVisit = new Date();
  await session.save();
  ctx.user = session.user;

  return next();
});
router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', me);

app.use(router.routes());

// this for HTML5 history in browser
const fs = require('fs');

const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx) => {
  if (ctx.url.startsWith('/api') || ctx.method !== 'GET') return;

  ctx.set('content-type', 'text/html');
  ctx.body = index;
});

module.exports = app;
