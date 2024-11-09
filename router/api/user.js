import { Router } from "express";
import User from "../../model/user.js";
import jwt from "jsonwebtoken";
import { authentication } from "../../libs/authentication.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({
      success: false,
      message: "fill all fields",
    });
  try {
    const foundUser = await User.findOne({ username });

    if (foundUser)
      return res.status(404).json({
        success: false,
        message: "already this user is registered ",
      });

    const user = new User({
      username,
      password,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "registeration is successfull",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
      error,
    });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({
      success: false,
      message: "fill all fields",
    });
  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user)
      return res.status(404).json({
        success: false,
        message: "Don't found this user ",
      });

    const isMatchedPassword = user.password === password;
    if (!isMatchedPassword)
      return res.status(404).json({
        success: false,
        message: "password is incorrect ",
      });
    const token = jwt.sign({ ssid: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "login is successfull",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
      error,
    });
  }
});

router.get("/current-user", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "Don't found this user ",
      });

    res.status(200).json({
      success: true,
      message: "current user",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
      error,
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
