import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(409).json({ message: "Email or Username already in use" });
  }

  const newUser = new User({
    username,
    email,
    passwordHash: password,
    role,
  });

  await newUser.save();

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
    accessToken,
    refreshToken,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Email/Username and password required" });
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

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
    },
    accessToken,
    refreshToken,
  });
});
