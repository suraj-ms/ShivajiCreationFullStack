const mongoose = require('mongoose');

const employeeWorkSchema = new mongoose.Schema({
  employeeId: {
    type: String, // Reference to the Employee model
    required: true,
    ref: 'Employee',
  },
  orderNumber: {
    type: String,
    required: true,
  },
  orderVariant: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now, // Set the default to the current date
  },
  endDate: {
    type: Date,
  },
  weekStart: {
    type: Date,
    required: true, // This will store the Monday of the week for this entry
  },
});

employeeWorkSchema.pre('save', function (next) {
  if (this.weekStart) {
    // Set time to midnight (start of the day)
    this.weekStart.setUTCHours(0, 0, 0, 0);
  }
  next();
});


// Export the WorkLog model
module.exports = mongoose.model('EmployeeWork', employeeWorkSchema);
