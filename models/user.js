const mongoose = require('mongoose');
const validator = require('validator');
require('mongoose-type-url');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/BadRequestError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: mongoose.SchemaTypes.Url,
    required: false,
    default: 'https://practicum.yandex.ru/trainer/web/lesson/232f6a79-0075-4280-9689-f198e0b66744/#:~:text=avatar%20%E2%80%94-,%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0,-%3B',
    validate: [validator.isURL, 'invalid link'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequestError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
