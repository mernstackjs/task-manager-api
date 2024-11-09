import { Router } from "express";
import Task from "../../model/task.js";
import { authentication } from "../../libs/authentication.js";
import User from "../../model/user.js";

const router = Router();

router.post("/", authentication, async (req, res) => {
  const { title, desc, priority } = req.body;
  const ownerID = req.user._id;

  try {
    if (!title || !desc || !priority) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    const tasks = new Task({ title, desc, priority, owner: ownerID });

    const owner = await User.findById(ownerID);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    owner.tasks.push(tasks);
    await owner.save();
    await tasks.save();

    res.status(201).json({
      success: true,
      message: "New task created successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner", "username -_id");

    if (!tasks) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "New task created successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
router.get("/my-tasks", authentication, async (req, res) => {
  const ownerID = req.user._id;
  try {
    const tasks = await Task.find({ owner: ownerID });

    if (!tasks) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "New task created successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
