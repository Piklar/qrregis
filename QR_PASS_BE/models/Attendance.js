const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  time_in: { 
    type: Date,
    required: [true, 'Time in is required']
  },
  time_out: { type: Date },
  date_in: { 
    type: Date,
    required: [true, 'Date in is required']
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Attendance', attendanceSchema);