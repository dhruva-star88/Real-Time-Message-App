import mongoose from "mongoose";

const TherapistSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("therapists", TherapistSchema);

export default UserModel;
