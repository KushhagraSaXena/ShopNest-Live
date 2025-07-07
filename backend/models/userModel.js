import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },

  favourites: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: []
  },
  //favourites is an array of product ids, which are referenced from the Product model
  //this allows us to store a list of favourite products for each user
},
  { timestamps: true }      //time of creating deleting and updating a user is recorded
);

const User = mongoose.model('User',userSchema);

export default User;