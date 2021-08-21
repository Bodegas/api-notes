const notFound = (request, response) => {
  response.status(404).end("<h1>Not found</h1>");
};

module.exports = notFound;
