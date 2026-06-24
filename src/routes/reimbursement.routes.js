const express = require('express');
const router = express.Router();
const reimbursementController = require('../controllers/reimbursement.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', reimbursementController.createReimbursement);
router.get('/my', reimbursementController.getMyReimbursements);
router.patch('/:id/status', reimbursementController.updateStatus);

module.exports = router;
