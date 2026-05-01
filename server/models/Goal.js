const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appName:           { type: String, required: true },
  dailyLimitMinutes: { type: Number, required: true },
  active:            { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);