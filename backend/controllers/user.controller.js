import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Warehouse from "../models/Warehouse.js";
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, warehouseName } = req.body;

  // Validation
  if (!username || !email || !password || !role) {
    return res.status(400).json({
      message: "Required fields: username, email, password, role",
    });
  }

  if (role !== "admin" && !warehouseName) {
    return res.status(400).json({
      message: "Warehouse name is required for non-admin roles",
    });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Email or username already exists" });
  }

  // Find warehouse if needed
  let warehouse = null;
  if (role !== "admin") {
    warehouse = await Warehouse.findOne({ name: warehouseName });
    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse not found with given name",
      });
    }
  }

  const newUser = new User({
    username,
    email,
    passwordHash: password, // Will be hashed by pre-save hook
    role,
    warehouses: warehouse ? [warehouse._id] : [],
  });

  await newUser.save();

  // Generate tokens
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  // Prepare response
  const responseUser = {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };

  if (warehouse) {
    responseUser.warehouse = {
      name: warehouseName,
      id: warehouse._id,
    };
  }

  res.status(201).json({
    message: "User registered successfully",
    user: responseUser,
    tokens: { accessToken, refreshToken },
  });
});
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // Now only needs username + password

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate new tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update user
  user.refreshTokens.push(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      assignedWarehouse: user.assignedWarehouse,
    },
    tokens: { accessToken, refreshToken },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash -refreshTokens"); // Hide sensitive data
  res.status(200).json({
    message: "All users fetched successfully",
    users,
  });
});
