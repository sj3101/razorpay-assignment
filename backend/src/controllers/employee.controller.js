const employeeService = require('../services/employee.service');

const getProfile = async (req, res) => {
  try {
    const profile = await employeeService.getEmployeeProfile(req.params.id);
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const assignManager = async (req, res) => {
  try {
    const { employeeId, managerId } = req.body;
    const assignment = await employeeService.assignManagerToEmployee(employeeId, managerId);
    return res.status(200).json({ message: 'Manager assigned successfully', assignment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  assignManager,
};
