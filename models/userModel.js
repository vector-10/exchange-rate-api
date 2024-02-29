const mongoose = require('mongoose');
const validator = require('mongoose');
const bcrypt = require('bcrypt');   

const userSchema = new mongoose.Schema({
    //data for user model
    name: {
        type: String,
        required: [true, "Please provide a FirstName to create an account"],
        minlength: 3,
        maxlength: [40, "Your FirstName should not exceed 20 characters"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email to create an account"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
      },
      password: {
        type: String,
        required: [true, "Please provide your password to create an account"],
      },
      confirmPassword: {
        type: String,
      },
      gender: {
        type: String,
        required: [true, "Please provide a gender to create an account"],
        enum: ["male", "female"],
      },
      nationality: {
        type: String,
        required: [true, "Please provide a nationality to create an account"],
      },
      role: {
        type: String,
        required:[true, "Please select a role on the platform"],
        enum: [ "admin", "user"]
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})


module.exports = mongoose.model("User", userSchema);