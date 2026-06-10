import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),

    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};
// @desc    Get user's saved cart and address
// @route   GET /api/users/sync
// @access  Private
export const getUserData = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ cartItems: user.cartItems || [], shippingAddress: user.shippingAddress || {} });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Save cart and address to database
// @route   POST /api/users/sync
// @access  Private
export const syncUserData = async (req, res) => {
  try {
    // ATOMIC FIX: Update the cart directly in the DB instead of fetching and calling .save()
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cartItems: req.body.cartItems } }, // Atomic replacement of the array
      { new: true, runValidators: true } // Returns the newly updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};