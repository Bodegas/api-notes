const notFound = (request, response) => {
  response.status(404).end("<h1>Wrong url</h1>");
};

module.exports = notFound;
