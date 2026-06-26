const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/:id', employeeController.getProfile);
router.post('/assign-manager', employeeController.assignManager);

module.exports = router;
