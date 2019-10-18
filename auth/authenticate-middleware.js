const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (error, decoded) => {
      if (error) {
          res.status(401).json({ you: 'nice try guy...' });
      } else {
        req.user = {
          username: decoded.username,
        };
        next();
      }
    });
  } else {
    res.status(400).json({ message: 'No token in use.' });
  }
};
