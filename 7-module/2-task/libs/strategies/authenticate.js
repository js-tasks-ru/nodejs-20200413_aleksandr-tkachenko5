const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  /**
   * Callback: done(err, data, info)
   * err - error that not related to the logic (for example server error).
   * data - data that passed, it can be user data (or false, if some of checks failed).
   * info - optional additional info, for example if some checks failed.
   * */

  try {
    /**
     * Check if the function is receive the user email.
     * */
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    /**
     * Find the user by the passed email.
     * */
    const user = await User.findOne({email});

    /**
     * If the user does not exist, create it, save it, pass it.
     * */
    if (!user) {
      const user = new User({email, displayName});
      await user.save();
      return done(null, user);
    }

    done(null, user);
  } catch (e) {
    done(e);
  }
};
