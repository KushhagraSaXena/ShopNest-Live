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

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Auth & Profile Routes
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route("/profile")
  .get(authenticate, getCurrentUserPorfile)
  .put(authenticate, updateCurrentUserProfile);


// Admin User Routes
router.route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.route('/:id')
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);


// ✅ Add a product to favourites
router.post('/favourites/add', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Missing productId" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: productId } },  // prevent duplicates
      { new: true }
    );

    res.json({ success: true, favourites: updatedUser.favourites.map(f => f.toString()) });
  } catch (err) {
    console.error("Add to favourites failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Remove a product from favourites
router.post('/favourites/remove', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Missing productId" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: productId } },
      { new: true }
    );

    res.json({ success: true, favourites: updatedUser.favourites.map(f => f.toString()) });
  } catch (err) {
    console.error("Remove from favourites failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get user's favourites (requires token)
router.get('/:userId/favourites', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(userId);
    res.json(user.favourites.map(f => f.toString()));
  } catch (err) {
    console.error("Fetch favourites failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// 🧪 Test Routes (Optional)
router.get('/test-favs/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favourites');
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/test-favs', async (req, res) => {
  try {
    const users = await User.find().populate('favourites');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
