const reimbursementService = require('../services/reimbursement.service');

const createReimbursement = async (req, res) => {
  try {
    const reimbursement = await reimbursementService.createReimbursement(req.user.id, req.body);
    return res.status(201).json({ message: 'Reimbursement created', reimbursement });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getMyReimbursements = async (req, res) => {
  try {
    const reimbursements = await reimbursementService.getMyReimbursements(req.user.id);
    return res.status(200).json({ reimbursements });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const role = req.user.role;
    
    const updated = await reimbursementService.updateApprovalFlow(id, role, status);
    return res.status(200).json({ message: 'Status updated', updated });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createReimbursement,
  getMyReimbursements,
  updateStatus,
};
