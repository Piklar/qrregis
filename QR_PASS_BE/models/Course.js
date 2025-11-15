const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Course name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  encryption_key: { 
    type: String, 
    required: [true, 'Encryption key is required'],
    minlength: [16, 'Encryption key must be at least 16 characters']
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);