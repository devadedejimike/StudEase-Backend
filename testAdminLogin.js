const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

const testLogin = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studease");
    console.log("DB connected");

    const admin = await User.findOne({ staffID: "ADM001" }).select("+password");
    if (!admin) return console.log("Admin not found");

    const passwordToTest = "Admin123";

    const isCorrect = await bcrypt.compare(passwordToTest, admin.password);

    console.log({
      candidate: passwordToTest,
      hash: admin.password,
      match: isCorrect
    });

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

testLogin();
