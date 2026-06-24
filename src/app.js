const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const reimbursementRoutes = require('./routes/reimbursement.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/reimbursements', reimbursementRoutes);

module.exports = app;
