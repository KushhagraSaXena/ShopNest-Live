const asyncHandler = (fn) => (req,res,next) => {   //this is a middleware so we pass next to it as well
  Promise.resolve(fn(req,res,next)).catch(error => {
    res.status(500).json({message: error.message});
  });
};

export default asyncHandler;