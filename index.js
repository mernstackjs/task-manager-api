import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./router/index.js";
import { dbConnected } from "./db.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import User from "./model/user.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/api", router);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.put("/update", upload.single("profilePicture"), async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user._id; // The authenticated user ID

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle profile picture upload
    if (req.file) {
      user.profilePicture = req.file.path; // Save the file path in the user model
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
dbConnected();
