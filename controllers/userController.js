const User = require('../models/userModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');


const registerUser  = catchAsyncErrors(async(req, res, next) => {
    try {
        // first we set the parameters needed to register in req.body
        const { firstName, middleName, lastName, email, password, confirmPassword, gender, nationality } = req.body;

        // validation to ensure the password and confirmPassword are the same
        if( password !== confirmPassword ) {
            return next(new ErrorHandler ("Please ensure that password and confirmPassword match", 403))
        }
        // to ensure that a user cannot register with an already exiting email
        const checkIfEmailExists = await User.findOne({ email });
        if(checkIfEmailExists) {
          return next (new ErrorHandler(`User account with email ${email} already exists`, 401))
        }
        //Now to auto assign admin role to first sign up, we check to see no of accouts existing. if equal to zero the accoutn is admin
        const firstAccount = await User.countDocuments({}) === 0;
        // Now we define the role for the account to first sign up
        let role = firstAccount? "admin":"user";
        // to ensure easy access on the frontend, we cocatenate the names
        const name = `${firstName} ${middleName} ${lastName}`

        // now we create the user with the mongoose method create
        const user = User.create({
            name,
            email,
            password,
            gender,
            nationality
        })
        // the return user json object format is defined in the JWToken.js utility
        sendToken(user, 201, res)
    } catch (error) {
        
    }
});


const loginUser = catchAsyncErrors(async(req, res, next) => {
    // first we set login credentials to he used on signup
    const { email, password } = req.body;
    //check to ensure email and password are provided
    if(!email || !password) {
      return next(new ErrorHandler("Please provide your email and password to login", 400));
    }
    // to ensure user already has an account 
    const user = await User.findOne({ email }).select('+password');
    if(!user) {
      return next(new ErrorHandler("Invalid Email provided", 401));
    }
  
    // check to see if the password correctly matches
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
      return next(new ErrorHandler("Invalid password provided", 401));
    }
    //once we are sure of everything, we can then login in the user
    sendToken(user, 200, res);
  });

  

const getAllUsers = catchAsyncErrors(async(req, res, next) => {
  try {
    const numberOfUsers = await User.countDocuments({});
    if (numberOfUsers === 0) {
      return next(new ErrorHandler ("No users currently exist in that database", 500))
    }
    // get all users from the database
    const allUsers = await User.find();
    
    // return users from the databse in json
    res.status(200).json({
      message: "All users successfully found",
      allUsers,
      userCount: numberOfUsers
    })
  } catch (error) {
    return next(new ErrorHandler ("Users could not be be retreived from the database", error, 500))
  }  
});


//To get user profile
const getUserProfile = catchAsyncErrors(async(req, res, next) => {
  // introduce try catch block for efficient error  handling
  try {
    //extract the user id from the params
    const userId = req.params.userId;
    const user = await User.findById(userId);
    //validation to make sure that a user is found
    if(!user){
      return next(new ErrorHandler(`User with ID ${userId} does not exist on database`))
    }
    // select the parameters to be sent to the client, to ensure security and protect information
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      nationality: user.nationality
    }
    
    // return the result in json
    res.status(200).json({
      message: "User Profile successfully found",
      userProfile
    })
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("User profile not successfully found", 500))
  }
});


// Update password route
const updatePassword = catchAsyncErrors(async(req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("New password and confirm new passwords do not match", 401));
    }

    // Fetch the user from the database
    const userId = req.params.userId;
    const user = await User.findById(userId);
    //console.log(user);

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return next(new ErrorHandler(`Please enter a new password`, 401));
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    sendToken(user, 200, res)
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler(`Internal server error ${error}`, 500));
  }
});



// Now to update user profile
const updateProfile = catchAsyncErrors(async(req, res, next) => {
  try {
  // set the userId to req.params.id
  const userId = req.params.userId;
   const user = await User.findById(userId);
 // ensure that user exists
 if(!user){
   return next(new ErrorHandler(`User with ID ${userId} not found for update`, 401))
 };
 //update user profile based on the fields you want to change
 user.firstName = req.body.firstName || user.firstName;
 user.middleName = req.body.middleName || user.middleName;
 user.lastName = req.body.lastname || user.lastName;
 user.email = req.body.email || user.email;
 user.gender = req.body.gender || user.gender;
 user.nationality = req.body.nationality || user.nationality;

   // Save the updated user
   await user.save();
   //return the updated parameters
   res.status(200).json({
    message: "User Profile successfully updated",
    userProfile: {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      nationality: user.nationality,
      
    },
  });
   } catch (error) {
    return next(new ErrorHandler("Error updating user profile", 500));
   }
});



const logoutUser = catchAsyncErrors(async(req, res, next) => {
  // inorder to logout users we have to expire the token stored in the cookie.
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    message: "You are logged out successfully!"
  });

});


//Get all users => /api/v1/admin/deleteUser
const deleteUser = catchAsyncErrors(async(req, res, next) => {
  // get the user throught the ID
  const userId = await req.params.id;
  const user = await User.findById(userId);
  //basic validation
  if(!user){
    return next(new ErrorHandler(`User with ID ${userId} not found on the database`))
  }
  // delete documents from the database
  await User.remove();
 
  res.status(200).json({
    message: "user successfuully deleted from database"
  });

});



module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateProfile,
  updatePassword,
  logoutUser
}