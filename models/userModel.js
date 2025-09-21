const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  matricNo: { type: Number, required: function() {return this.role === 'student'}, unique: true, sparse: true}, 
  staffID: {type: String, required: function() {return this.role !== 'student'}, unique: true, sparse: true}, 
  email: { type: String, required: function() {return this.role === 'student'}, unique: true, lowercase: true, sparse: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.correctPassword = async function(candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

module.exports = mongoose.model('User', userSchema);
