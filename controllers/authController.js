const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  try {
    const { name, matricNo, email, password } = req.body;
    const user = await User.create({ name, matricNo: Number(matricNo), email, password });
    res.status(201).json({ status: 'success', token: signToken(user._id), data: { user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { matricNo, staffID, password } = req.body;
    let user;

    if (matricNo && !isNaN(Number(matricNo))) {
      // student login
      user = await User.findOne({ matricNo: Number(matricNo) }).select("+password");
    } else if (staffID) {
      // staff/admin login
      user = await User.findOne({ staffID }).select("+password");
    }

    if (!user) {
      return res.status(401).json({ status: "fail", message: "User not found" });
    }

    const isCorrect = await user.correctPassword(password.trim(), user.password);

    if (!isCorrect) {
      return res.status(401).json({ status: "fail", message: "Invalid credentials" });
    }

    res.status(200).json({
      status: "success",
      token: signToken(user._id),
      data: { user }
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

