const mongoose = require("mongoose");
const User = require("./User");

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: [true, "Please provide user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobModel", jobsSchema);
