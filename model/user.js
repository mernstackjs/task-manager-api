import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,

      unique: true,
    },
    email: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePicture: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
