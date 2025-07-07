import User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from "bcryptjs";
import createToken from '../utils/createToken.js';


//first create the async handler or sign handler
const createUser = asyncHandler(async (req, res) => {
  // res.send("Hello from userController");

  const { username, email: rawEmail, password } = req.body;
  const email = rawEmail.toLowerCase();
  // console.log(username);
  // console.log(email);
  // console.log(password); //for checking the api call

  if (!username || !email || !password) {
    throw new Error("Provide All Inputs! ")
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("user already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });  //specifi that hashedpassword is password

  try {
    await newUser.save();     //.save is moongose method to store data in the database  //no password should be stored in database
    createToken(res, newUser._id); //when data is save in satabase then  and new user is created then create token

    res
      .status(201)
      .json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });

  } catch (error) {
    res.status(400)
    throw new Error("Invalid user data")
  }
});

//login endpoint
//this is for login user and create token for that user

const loginUser = asyncHandler(async (req, res) => {
  const { email: rawEmail, password } = req.body;
  const email = rawEmail.toLowerCase(); // Always convert email to lowercase

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      createToken(res, existingUser._id)   //create a token and set it as cookie into the header

      res
        .status(201)
        .json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
        });
      return;  //exit the function after sending the response
    }
  }
  // If user not found or password is invalid, send error response
  res.status(401).json({ message: "Invalid email or password" });
});

const logoutCurrentUser = asyncHandler(async (req,res) => {
  // res.send("Login u out");
  res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0),
  })

  res.status(200).json({message: "Logged Out successfully"})
});

const getAllUsers = asyncHandler(async (req,res) => {
  const users = await User.find({})       //empty for all user ie we get all users
  res.json(users);
});

const getCurrentUserPorfile = asyncHandler(async (req,res) => {
  const user = await User.findById(req.user._id)

  if(user){
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    })
  } else {
    res.status(404)
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req,res) => {
  const user = await User.findById(req.user._id);

  if(user){     //if user exist and logged in then update its data else show warning of no user
    user.username = req.body.username || user.username     //either stick to the old user name or use new user name provided by user in the body
    user.email = req.body.email || user.email  //if user skip providing email then stick to old one
  
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);   //hashed the new password again and then set it
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();      //saving that new data to the updated 1 ie in the database by using the save method
  
    res.json({                //show user response when updated
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
  else {
    res.status(404);
    throw new Error("User not found!");
  }
  
});

const deleteUserById = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id)   //this deletion function route need user id so we get id

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot Delete Admin user!')
    }

    await User.deleteOne({_id: user._id})
    res.json({message : "User removed"})
  } else {
    res.status(404)
    throw new Error("User not found!");
  }

});


const getUserById = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id).select('-password')  // get all details of that user from its id Except Password

  if(user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }

});

const updateUserById = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id)

  if(user){
    user.username = req.body.username || user.username      //if provided else use the old one
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser.__id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,       //did not update the password even admin is not allowed to update the password
    })
  } else {
    res.status(404);
    throw new Error("User not found");
  }

});

export { 
  createUser, 
  loginUser, 
  logoutCurrentUser, 
  getAllUsers, 
  getCurrentUserPorfile ,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById
};
