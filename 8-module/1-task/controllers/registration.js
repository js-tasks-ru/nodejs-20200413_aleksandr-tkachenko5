const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  /**
   * Create a new user token.
   * */
  const token = uuid();


  /**
   * Provided user data:
   * Email,
   * Password,
   * Display Name.
   * */
  const userData = ctx.request.body;

  /**
   * If such user exist, return the error.
   * */
  const isExistingUser = await User.findOne({email: userData.email});
  if (isExistingUser) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  /**
   * Create a new user object.
   */
  userData.verificationToken = token;
  const user = new User(userData);
  await user.setPassword(userData.password);
  await user.save();

  const opts = {
    template: 'confirmation',
    locals: {token: token},
    to: userData.email,
    subject: 'Verify your email, please',
  };

  if (await sendMail(opts)) {
    ctx.status = 200;
    ctx.body = {status: 'ok'};
    return;
  }
};

module.exports.confirm = async (ctx, next) => {
  /**
   * Get the verification token from the request
   * */
  const {verificationToken} = ctx.request.body;

  /**
   * Find the user by the verification token
   * */
  const user = await User.findOne({verificationToken});

  /**
   * If the user was not found, return the error
   * */
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  /**
   * Remove verification token and update the user
   * */
  user.verificationToken = undefined;
  user.markModified('verificationToken');
  await user.save();

  /**
   * Authenticate the user
   * */
  const token = await ctx.login(user);
  ctx.body = {token};
};
