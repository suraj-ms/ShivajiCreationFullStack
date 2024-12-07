const Employee = require('../model/EmployeesModel');
const ItemPrice = require('../model/Item&Price');

exports.createEmp = async (req, res) => {
  try {
    const { empid, empName, empNumber, empAadhaarNumber, empVariant } = req.body;

    // Validate empVariant if provided
    if (empVariant && empVariant.length > 0) {
      const validVariants = await ItemPrice.find({ itemName: { $in: empVariant } });
      if (validVariants.length !== empVariant.length) {
        return res.status(400).json({
          message: 'One or more variant item names do not exist in ItemPrice.',
        });
      }
    }

    // Create a new Employee instance, setting _id to empid if provided
    const newEmployee = new Employee({
      _id: empid, // Custom _id
      empName,
      empNumber,
      empAadhaarNumber,
      empVariant,
    });

    // Save the new employee to the database
    await newEmployee.save();

    // Respond with the newly created employee data
    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: 'Error creating employee',
      error: error.message,
    });
  }
};

exports.updateEmp = async (req, res) => {
  try {
    const { empid } = req.params; // Get the employee ID from the URL parameters
    const { empName, empNumber, empAadhaarNumber, empVariant } = req.body; // Get the updated fields from the request body

    // Validate empVariant if provided
    if (empVariant && empVariant.length > 0) {
      const validVariants = await ItemPrice.find({ itemName: { $in: empVariant } });
      if (validVariants.length !== empVariant.length) {
        return res.status(400).json({
          message: 'One or more variant item names do not exist in ItemPrice.',
        });
      }
    }

    // Find the employee by empid and update the fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      empid, // Use the empid as the identifier
      {
        empName,
        empNumber,
        empAadhaarNumber,
        empVariant,
      },
      { new: true, runValidators: true } // Return the updated document and apply schema validation
    );

    // If the employee with the given empid doesn't exist
    if (!updatedEmployee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // Respond with the updated employee data
    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      message: 'Error updating employee',
      error: error.message,
    });
  }
};

exports.deleteEmp = async (req, res) => {
  try {
    const { empid } = req.params; // Get the employee ID from the URL parameters

    // Find the employee by empid and delete it
    const deletedEmployee = await Employee.findByIdAndDelete(empid);

    // If no employee is found with the given empid, return 404
    if (!deletedEmployee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // Respond with success message and deleted employee data
    res.status(200).json({
      message: 'Employee deleted successfully',
      employee: deletedEmployee, // Optionally return the deleted employee data
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      message: 'Error deleting employee',
      error: error.message,
    });
  }
};

exports.getSingleEmp = async (req, res) => {
  try {
    const { empid } = req.params; // Get the employee ID from the URL parameters

    // Find the employee by empid
    const employee = await Employee.findById(empid);

    // If no employee is found with the given empid, return 404
    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found',
      });
    }

    // Respond with the employee data
    res.status(200).json({
      message: 'Employee fetched successfully',
      employee: employee,
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      message: 'Error fetching employee',
      error: error.message,
    });
  }
};

exports.getAllEmp = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const employees = await Employee.find().skip(skip).limit(limit);
    const totalEmployees = await Employee.countDocuments();

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        message: 'No employees found',
      });
    }

    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      message: 'Employees fetched successfully',
      employees: employees,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalEmployees: totalEmployees,
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      message: 'Error fetching employees',
      error: error.message,
    });
  }
};


