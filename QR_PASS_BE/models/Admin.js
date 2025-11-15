const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: [true, 'Admin ID is required'],
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  createdAt: { type: Date, default: Date.now }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = CryptoJS.AES.encrypt(this.password, process.env.ADMIN_SECRET).toString();
  next();
});

module.exports = mongoose.model('Admin', adminSchema);