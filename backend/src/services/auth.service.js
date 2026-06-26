const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');
require('dotenv').config();

const registerUser = async (data) => {
  const existingUser = await userRepository.getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userToCreate = {
    ...data,
    password: hashedPassword,
  };

  const newUser = await userRepository.createUser(userToCreate);
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const loginUser = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

module.exports = {
  registerUser,
  loginUser,
};
