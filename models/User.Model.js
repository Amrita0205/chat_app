import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  groups: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Group",
    },
  ],
});

const User=mongoose.model('User',UserSchema);
export default User;