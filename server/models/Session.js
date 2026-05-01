const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appName:      { type: String, required: true },
  minutesSpent: { type: Number, required: true },
  date:         { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);