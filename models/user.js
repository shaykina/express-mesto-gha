const mongoose = require('mongoose');
require('mongoose-type-url');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Пользователь не найден');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
