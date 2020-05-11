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
  console.log(isExistingUser);
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
};

module.exports.confirm = async (ctx, next) => {
};
