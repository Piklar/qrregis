const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { 
    type: String, 
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Za-z0-9\-]+$/.test(v);
      },
      message: 'Invalid student ID format'
    }
  },
  name: { 
    type: String, 
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  course_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);