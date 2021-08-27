/* eslint-disable no-unused-vars */
const HANDLERS = {
  CastError: (response, error) =>
    response.status(400).send({ error: "id sent is wrong" }),

  ValidationError: (response, error) => response.status(400).send(error),

  JsonWebTokenError: (response, error) =>
    response.status(401).send({ error: "Invalid token" }),

  Default: (response, error) => response.status(500).end(),
};

const handleErrors = (error, request, response, next) => {
  const errorName = error.name || "Default";
  HANDLERS[errorName](response, error);
};

module.exports = handleErrors;
