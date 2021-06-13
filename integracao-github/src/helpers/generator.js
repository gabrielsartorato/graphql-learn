const jwt = require('jsonwebtoken');

module.exports = {
  createToken(id) {
    return jwt.sign({ id }, 'secret', { expiresIn: '2d' });
  },

  verifyToken(token) {
    return jwt.verify(token, 'secret');
  },
};
