const jwt = require("jsonwebtoken");

const tokenValidator = (request, response, next) => {
  const tokenReceived = request.get("Authorization") || "";
  if (
    !tokenReceived ||
    !tokenReceived.toLowerCase().startsWith("bearer") ||
    !tokenReceived.substring(7)
  ) {
    return response
      .status(401)
      .send({ error: "Authorization header is missing" });
  }
  const token = tokenReceived.substring(7);
  let decodedToken = "";
  decodedToken = jwt.verify(token, process.env.JWT_KEY);

  request.userId = decodedToken.id;
  next();
};

module.exports = tokenValidator;
