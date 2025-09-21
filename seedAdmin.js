const mongoose = require("mongoose");
const User = require("./models/userModel");

const seedAdmin = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studease");
    console.log("DB connection successful");

    // Create admin user (plain password, will be hashed automatically)
    const admin = new User({
      name: "System Admin",
      staffID: "ADM001",
      password: "Admin123", // plain password
      role: "admin",
    });

    await admin.save();
    console.log("Admin account created successfully");
    console.log("Plain password for login:", "Admin123"); // for reference

  } catch (err) {
    console.error("Error seeding admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
