const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  date: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
