import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const authentication = async (req, res, next) => {
  const token = req.cookies["token"];

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details
    const user = await User.findById(decoded.ssid).select("-password"); // Exclude password

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user to request for downstream access
    req.user = user;
    next();
  } catch (error) {
    // Check for token expiration or other JWT-related errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Authentication failed." });
    } else {
      console.error("Authentication error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during authentication." });
    }
  }
};
