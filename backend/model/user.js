import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin","creators", "student"],
    default: "student", // ✅ Fixed: String should be in quotes
  },
 
  photourl: {
    type:String,
    default: "",
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  isExpired: {
    type: Date,
    required: [true, "verify expiry is required"],
  },
  verifycode: {
    type: String,
    required: true,
  },
 
}, { timestamps: true }); // ✅ Fixed: timestamps should be lowercase

export const UserModel = mongoose.model("User", userSchema);
