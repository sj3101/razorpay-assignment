const reimbursementRepository = require('../repositories/reimbursement.repository');

const createReimbursement = async (employeeId, data) => {
  const newReimbursement = await reimbursementRepository.createReimbursement({
    ...data,
    employeeId,
  });
  return newReimbursement;
};

const getMyReimbursements = async (employeeId) => {
  return await reimbursementRepository.getReimbursementsByEmployee(employeeId);
};

const updateApprovalFlow = async (id, role, status) => {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Status must be APPROVED or REJECTED');
  }

  const reimbursement = await reimbursementRepository.getReimbursementById(id);
  if (!reimbursement) {
    throw new Error('Reimbursement not found');
  }

  if (reimbursement.finalStatus !== 'PENDING') {
    throw new Error('Reimbursement processing is already complete');
  }

  let updatePayload = {};

  if (role === 'RM') {
    if (reimbursement.rmApproval !== 'PENDING') {
      throw new Error('RM has already provided approval status');
    }
    
    updatePayload.rmApproval = status;
    if (status === 'REJECTED') {
      updatePayload.finalStatus = 'REJECTED';
    }
  } else if (role === 'APE') {
    if (reimbursement.rmApproval !== 'APPROVED') {
      throw new Error('Waiting for RM approval first');
    }
    if (reimbursement.apeApproval !== 'PENDING') {
      throw new Error('APE has already provided approval status');
    }

    updatePayload.apeApproval = status;
    if (status === 'REJECTED') {
      updatePayload.finalStatus = 'REJECTED';
    }
  } else if (role === 'CFO') {
    if (reimbursement.apeApproval !== 'APPROVED') {
      throw new Error('Waiting for APE approval first');
    }

    if (status === 'APPROVED') {
      updatePayload.finalStatus = 'APPROVED';
    } else if (status === 'REJECTED') {
      updatePayload.finalStatus = 'REJECTED';
    }
  } else {
    throw new Error('Invalid role for approval flow');
  }

  const updated = await reimbursementRepository.updateReimbursementStatus(id, updatePayload);
  return updated;
};

module.exports = {
  createReimbursement,
  getMyReimbursements,
  updateApprovalFlow,
};
