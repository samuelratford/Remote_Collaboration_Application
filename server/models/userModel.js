// This code is written by Samuel Ratford in its entirety

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// var allowedExtensionsSchema = new Schema({ type: String });
var allowedExtensionsSchema = new Schema({ type: String });

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 6 },
  password: { type: String, required: true, unique: false, trim: true, minlength: 6 },
  name: { type: String, required: true, unique: false, trim: true, minlength: 1 },
  allowedExtensions: [{ type: String, minlength: 1 }]
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;