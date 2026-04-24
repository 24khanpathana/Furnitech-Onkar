const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'worker'], required: true },
    approved: { type: Boolean, default: false },
    resetCodeHash: { type: String },
    resetCodeExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
