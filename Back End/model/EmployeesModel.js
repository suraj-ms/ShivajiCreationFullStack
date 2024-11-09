const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId(),
  },
  empName: {
    type: String,
    required: true,
  },
  empNumber: {
    type: String,
    // required: true,
  },
  empAadhaarNumber: {
    type: String,
    // required: true,
  },
  empVariant: [String], // Array of item names
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;


