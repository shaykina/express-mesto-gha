const router = require('express').Router();
const {
  getUsers, getUserById, createUser, changeProfile, changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', changeProfile);

router.patch('/me/avatar', changeAvatar);

module.exports = router;
