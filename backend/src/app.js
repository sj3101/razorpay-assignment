const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const reimbursementRoutes = require('./routes/reimbursement.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve frontend static files — no CORS needed since everything is same-origin
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

// Allow CORS for any remaining cross-origin requests (e.g. Postman, testing)
app.use(cors({ origin: true, credentials: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/reimbursements', reimbursementRoutes);

// Fallback: serve index.html for any unknown routes (SPA support)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;
