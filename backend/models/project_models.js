import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: [true, "Project name must be unique"],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  fileTree: {
    type: Object,
    default: {},
  },
  messages: [
    {
      message: { type: String },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
