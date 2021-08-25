// eslint-disable-next-line no-unused-vars
const handleErrors = (error, request, response, next) => {
  if (error.name === "CastError") {
    response.status(400).send({ error: "id sent is wrong" });
    return;
  }
  if (error.name === "ValidationError") {
    response.status(400).send(error);
  }
  response.status(500).end();
};

module.exports = handleErrors;
