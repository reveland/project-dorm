var bcrypt = require('bcryptjs');

module.exports = {
  identity: 'user',
  connection: 'default',

  attributes: {

    email: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string',
    },
    id: {
      type: 'string',
      unique: true
    },
    name: {
      type: 'string',
    },
  }
};