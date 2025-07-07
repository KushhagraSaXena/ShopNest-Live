import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

//authenticate user credentials ie password email username etc and also token ===> if token is valid user is able to login and logout if not then show error

const authenticate = asyncHandler(async (req,res,next) => {
  let token;

  //Read the JWT from the 'jwt' cookie
  token = req.cookies .jwt      //jwt was the name of cookie token ie requesting jwt within the cookie in postman as can be seen

  if(token){
    try {
      
      const  decoded = jwt.verify(token, process.env.JWT_SECRET)         //verify method of the jwt to check and verify
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401)
      throw new Error("Not aurhorized, token failed.")
    }
  }
  else {
    res.status(401)
    throw new Error("Not authorized, no token.")
  }
});

// check for admin : if user is admin then validate
const authorizeAdmin = (req,res,next) => {
if(req.user && req.user.isAdmin){
  next();
}
else{
  res.status(401).send("Not authorized as an Admin.")
  }
}

export {authenticate ,authorizeAdmin}