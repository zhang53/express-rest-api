const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  passwordReset: {
    token: {
      type: String
    },
    expire: {
      type: Date
    }
  },
  provider: {
    type: String,
    enum: ['google', 'facebook']
  },
  roles: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);