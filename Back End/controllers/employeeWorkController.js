const EmployeeWork = require('../model/employeeWorkModel');
const Employee = require('../model/EmployeesModel')

exports.createWorkLog = async (req, res) => {
  try {
    const { employeeId, orderNumber, orderVariant, quantity, startDate, endDate, weekStart } = req.body;

    // Validate required fields
    if (!employeeId || !orderNumber || !orderVariant || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Normalize `weekStart` to midnight; set to user input or default to current week's Monday
    let normalizedWeekStart;

    if (weekStart) {
      // If provided, parse `weekStart` as a Date object and set time to midnight
      normalizedWeekStart = new Date(weekStart);
      normalizedWeekStart.setUTCHours(0, 0, 0, 0);
    } else {
      // If `weekStart` is not provided, set it to the most recent Monday
      const today = new Date();
      const dayOfWeek = today.getUTCDay();
      const daysSinceMonday = (dayOfWeek + 6) % 7; // Calculate days since the last Monday
      normalizedWeekStart = new Date(today);
      normalizedWeekStart.setUTCDate(today.getUTCDate() - daysSinceMonday);
      normalizedWeekStart.setUTCHours(0, 0, 0, 0);
    }

    // Create a new work log entry with the normalized `weekStart`
    const newWorkLog = new EmployeeWork({
      employeeId,
      orderNumber,
      orderVariant,
      quantity,
      startDate: startDate ? new Date(startDate) : Date.now(),
      endDate: endDate ? new Date(endDate) : null,
      weekStart: normalizedWeekStart,
    });

    // Save the work log
    await newWorkLog.save();
    res.status(201).json({ message: 'Work log created successfully', newWorkLog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating work log', error });
  }
};

exports.deleteEmployeeWork = async (req, res) => {
  try {
    const { workLogId } = req.params; // Get the ID from request parameters

    // Validate that an ID is provided
    if (!workLogId) {
      return res.status(400).json({ message: 'Missing required work log ID' });
    }

    // Attempt to delete the specified work log by ID
    const deletedWorkLog = await EmployeeWork.findByIdAndDelete(workLogId);

    if (deletedWorkLog) {
      res.status(200).json({ message: 'Work log deleted successfully', deletedWorkLog });
    } else {
      res.status(404).json({ message: 'No work log found with the specified ID' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting work log', error });
  }
};

exports.getWorkLogsByWeek = async (req, res) => {
  try {
    const { weekStart } = req.query;

  
    if (!weekStart) {
      return res.status(400).json({ message: 'Missing required weekStart date' });
    }
    const weekStartDate = new Date(weekStart);
    const workLogs = await EmployeeWork.find({ weekStart: weekStartDate });

    if (workLogs.length > 0) {
      res.status(200).json({ message: 'Work logs for the specified week', workLogs });
    } else {
      res.status(404).json({ message: 'No work logs found for the specified week' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving work logs', error });
  }
};

exports.getEmployeeWorkLogsByDateRange = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields: employeeId, startDate, or endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date cannot be later than end date' });
    }

    // Adjusting the query to find work logs where the weekStart falls between start and end dates
    const workLogs = await EmployeeWork.find({
      employeeId: employeeId,
      startDate: {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      },
    });

    if (workLogs.length > 0) {
      res.status(200).json({ message: 'Work logs for the specified date range and employee', workLogs });
    } else {
      res.status(404).json({ message: 'No work logs found for the specified date range and employee' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving work logs', error });
  }
};


exports.updateWorkLog = async (req, res) => {
  try {
    const { employeeId, workLogId } = req.params; // Get employeeId and workLogId from route parameters
    const { orderNumber, orderVariant, quantity, startDate, endDate, weekStart } = req.body;

    // Validate that the work log ID belongs to the correct employee
    const workLog = await EmployeeWork.findOne({ _id: workLogId, employeeId });

    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found or does not belong to this employee' });
    }

    // Prepare the updated data
    const updatedData = {};

    if (orderNumber) updatedData.orderNumber = orderNumber;
    if (orderVariant) updatedData.orderVariant = orderVariant;
    if (quantity) updatedData.quantity = quantity;
    if (startDate) updatedData.startDate = new Date(startDate);
    if (endDate) updatedData.endDate = new Date(endDate);
    if (weekStart) {
      // Normalize weekStart to midnight if provided
      const normalizedWeekStart = new Date(weekStart);
      normalizedWeekStart.setUTCHours(0, 0, 0, 0); // Remove time component
      updatedData.weekStart = normalizedWeekStart;
    }

    // Perform the update operation
    const updatedWorkLog = await EmployeeWork.findByIdAndUpdate(workLogId, updatedData, {
      new: true, // Return the updated document
    });

    // If successful, return the updated work log
    res.status(200).json({
      message: 'Work log updated successfully',
      updatedWorkLog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating work log', error });
  }
};


