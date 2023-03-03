const Card = require('../models/card');
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({
      message: "Пост удалён"
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Произошла неизвестная ошибка' });
    });
}