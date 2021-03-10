const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/', userController.getUsers);

router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('name').not().isEmpty(),
    check('password').isLength({ min: 6 }),
  ],
  userController.signup
);

router.post('/login', userController.login);

module.exports = router;
