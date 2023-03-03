const router = require('express').Router();
const { getUsers, getUserById, createUser, changeProfile, changeAvatar } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', changeProfile);

router.patch('/users/me/avatar', changeAvatar);

module.exports = router;