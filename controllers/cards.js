const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет права доступа');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((item) => res.send(item))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((data) => {
      data.populate(['owner', 'likes'])
        .then((card) => res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card._id,
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      data.populate(['owner', 'likes'])
        .then((card) => res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card._id,
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      data.populate(['owner', 'likes'])
        .then((card) => res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card._id,
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
