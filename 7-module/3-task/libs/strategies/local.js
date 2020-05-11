const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await User.login(email, password);

      if (user instanceof User) {
        return done(null, user);
      } else {
        return done(null, false, user);
      }
    }
);
