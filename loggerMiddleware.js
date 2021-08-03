const logger = (request, response, next) => {
  const { method, path, body } = request;
  console.log({ method });
  console.log({ path });
  console.log({ body });
  next();
};

module.exports = logger;
