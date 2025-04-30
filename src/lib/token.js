const jwt = require('jsonwebtoken');

const generatedToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token akan kedaluwarsa dalam 1 jam
 });
  return token;
};

module.exports = generatedToken;
