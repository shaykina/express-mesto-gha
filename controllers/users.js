const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан несуществующий _id пользователя'));
      }
      if (err.name === 'TypeError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан несуществующий _id пользователя'));
      }
      if (err.name === 'TypeError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email) {
    throw new BadRequestError('Введите email');
  }
  if (!password) {
    throw new BadRequestError('Введите password');
  }
  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email: email,
      password: hash
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.changeProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
      password: user.password,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'TypeError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

module.exports.changeAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
      password: user.password,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.name === 'TypeError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка при авторизации'));
    });

  };
