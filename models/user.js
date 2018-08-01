const mongoose = require('mongoose');  //abstracting mongodb operations
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email:    {type: String, required: true},
  features: {type: Array, default:[]}
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
