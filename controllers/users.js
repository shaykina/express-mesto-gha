const User = require('../models/user');
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.changeProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    {
      name: req.body.name,
      about: req.body.about
    },
    { new: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    {
      avatar: req.body.avatar
    },
    { new: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      if (err.name === 'Not Found') {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}