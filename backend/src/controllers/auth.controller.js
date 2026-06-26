const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  me,
};
