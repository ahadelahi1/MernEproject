const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  hallNumber: {
    type: String,
    required: true
  },
  numberOfBooths: {
    type: Number,
    required: true
  },
  expoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true
  }
});

module.exports = mongoose.model('Hall', hallSchema);
