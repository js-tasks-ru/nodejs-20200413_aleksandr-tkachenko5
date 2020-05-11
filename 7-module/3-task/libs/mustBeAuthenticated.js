module.exports = function mustBeAuthenticated(ctx, next) {
  /**
   * Check, if the user object does not exist, return the error.
   * */
  if (!ctx.user) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }
  return next();
};
