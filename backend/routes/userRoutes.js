import express from "express";
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

import {
  createUser, 
  loginUser, 
  logoutCurrentUser, 
  getAllUsers,
  getCurrentUserPorfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../controllers/userController.js';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);  //this is the homepage for user and we first create the user with post and this is done in server controller

http://localhost:5000/api/users/auth
router.post("/auth", loginUser)
router.post("/logout", logoutCurrentUser);

//for specific user data updation and usage => create profile
router
  .route("/profile")
  .get(authenticate, getCurrentUserPorfile)
  .put(authenticate,updateCurrentUserProfile);


//ADMIN ROUTES
//admin side routing for updation getting and deletion of users
router
.route('/:id')
.delete(authenticate, authorizeAdmin, deleteUserById)
.get(authenticate, authorizeAdmin, getUserById)
.put(authenticate, authorizeAdmin, updateUserById);  //requires the user id for deletions //and only admin can delete users

// Add a product to favourites
router.post('/favourites/add', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) return res.status(400).json({ error: "Missing productId" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: productId } },
      { new: true }
    );

    // console.log("Updated favourites:", updatedUser.favourites); // ✅ check what’s saved
    // Always return array of product IDs (strings)
    res.json({ success: true, favourites: updatedUser.favourites.map(f => f.toString()) });
  } catch (err) {
    console.error("Add to favourites failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Remove a product from favourites
router.post('/favourites/remove', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: productId } },
      { new: true }
    );
    // Always return array of product IDs (strings)
    res.json({ success: true, favourites: user.favourites.map(f => f.toString()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's favourites
router.get('/:userId/favourites', authenticate, async (req, res) => {
  try {
    // Only allow users to get their own favourites or admin
    if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findById(req.params.userId);
    // Always return array of product IDs (strings)
    res.json(user.favourites.map(f => f.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/test-favs/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favourites');
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Test route to get all users with their favourites
router.get('/test-favs', async (req, res) => {
  try {
    const users = await User.find().populate('favourites');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;