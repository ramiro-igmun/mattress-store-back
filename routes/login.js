/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

/**
 * If the user is authenticated it returns a personal JWT
 */
loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findOne({ email: body.email });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  return response
    .status(200)
    .send({ token, email: user.email });
});

module.exports = loginRouter;
