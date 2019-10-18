const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');
const secrets = require('../config/secrets.js');

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json({ message: 'User could not be added.', error });
      });
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;
  
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'The credentials used, are incorrect.' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    username: user.username,
    department: user.department
  };
  const options = {
    expiresIn: '10000',
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
