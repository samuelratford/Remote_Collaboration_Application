// This code is written by Samuel Ratford in its entirety

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// var allowedExtensionsSchema = new Schema({ type: String });
var allowedExtensionsSchema = new Schema({ type: String });

const extensionSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, minlength: 6 },
  description: { type: String, required: true, unique: false, trim: false, minlength: 6 },
  link: { type: String, required: true, unique: false, trim: true, minlength: 6 },
  accessToken: { type: String, required: false, unique: false, trim: true, minlength: 1 }
}, {
  timestamps: true,
});

const Extension = mongoose.model('Extension', extensionSchema);

module.exports = Extension;