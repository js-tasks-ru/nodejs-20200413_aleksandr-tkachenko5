const mongoose = require('mongoose');
const crypto = require('crypto');
const connection = require('../libs/connection');
const config = require('../config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.',
      },
    ],
    unique: 'Такой email уже существует',
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует',
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
}, {
  timestamps: true,
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
        password, salt,
        config.crypto.iterations,
        config.crypto.length,
        config.crypto.digest,
        (err, key) => {
          if (err) return reject(err);
          resolve(key.toString('hex'));
        }
    );
  });
}

function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

// eslint-disable-next-line valid-jsdoc
/**
 * userSchema statics.
 * More about methods and statics:
 * https://monsterlessons.com/project/lessons/statics-i-methods-v-mongoose
 *
 * Looking for the user in the database by the provided login and password
 * */
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({email}).select('+password +salt');

  /**
   * If there is no such user, return the error message
   * */
  if (!user) {
    return 'No such user';
  }

  /**
   * Check the provided password for correctness.
   * If the password is wrong, return the error message.
   * */
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    return 'Incorrect password';
  }

  /**
   * Return the user object
   * */
  return user;
};

module.exports = connection.model('User', userSchema);
