const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const DUMMY_USER = [
  {
    id: 'u1',
    name: 'max schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.json({ user: DUMMY_USER });
};
const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid  seem wrong ', 422);
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USER.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError('email is already exits', 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USER.push(createdUser);

  res.status(201).json({ user: createdUser });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USER.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, cedentials seem to be wrong', 401);
  }
  res.json({ message: 'loggin in' });
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
