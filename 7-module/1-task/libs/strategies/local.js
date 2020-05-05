const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      /**
       * Find a user by the given email
       * */
      const user = await User.findOne({email}, {});

      /**
       * If there is no such user, return the error message
       * */
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      /**
       * Check the provided password for correctness.
       * If the password is wrong, return the error message.
       * */
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return done(null, false, 'Неверный пароль');
      }

      /**
       * In case of correctness, return the user object.
       * */
      done(null, user);
    }
);
