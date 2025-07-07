//first we create token and set it to the cookie

import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });               //THIS IS THE TOKEN CREATION

  //Set the JWT as an Http-only cookie
  res.cookie('jwt', token, {        //it is used as to check  user is logged in using the cookie or not
    httpOnly: true,
    secure: process.env.NODE_ENV != 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  return token;
};

export default generateToken;