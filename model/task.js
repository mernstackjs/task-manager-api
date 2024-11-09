import { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: String,
    desc: String,
    priority: String,
    isComplate: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;
