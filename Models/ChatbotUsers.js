//libraries
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatbotUserSchema = new Schema({
  Name_pet: [String],
  type_pet: [String],
  Name_user: String,
  direction_user: String,
  phone_number_user: Number,
  dni_user: {
    type: Number,
    unique: true
  }
},
{timestamps: true});

module.exports = mongoose.model('ChatbotUser', ChatbotUserSchema);