const loginRouter = require("express").Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;
    if (!username) {
      return response.status(400).send({ error: "username field is required" });
    }
    if (!password) {
      return response.status(400).send({ error: "password field is required" });
    }

    const users = await User.find({ username });
    if (!users.length) {
      return response
        .status(401)
        .send({ error: "username or password not valid" });
    }
    const { _id, passwordHash } = users[0];

    const passwordValid = await bcrypt.compare(password, passwordHash);
    if (!passwordValid) {
      return response
        .status(401)
        .send({ error: "username or password not valid" });
    }

    const dataToSign = { id: _id, username };
    const token = jwt.sign(dataToSign, process.env.JWT_KEY);
    response.status(200).send({
      id: _id,
      username,
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
