import mongoose, { Schema } from "mongoose";
import { StudentProfileType } from "../Types/types";

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: ""
    },
    githubProfile: {
      type: String,
      default: "",
    },
    linkedinProfile: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<StudentProfileType>(
  "StudentProfile",
  UserSchema,
  "StudentProfiles"
);
