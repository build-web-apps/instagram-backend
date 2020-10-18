const jwt = require("jsonwebtoken");

const jwtSecrets = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
};

let auth = {};
auth.newToken = (user) => {
  console.log("jwt-userid", user.id);
  return jwt.sign({ id: user.id }, jwtSecrets.jwt, {
    expiresIn: jwtSecrets.jwtExp,
  });
};

auth.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtSecrets.jwt, (err, user) => {
      if (err) {
        return res.status(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = auth;
