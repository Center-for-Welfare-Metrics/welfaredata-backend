import mongoose, { Schema } from "mongoose";

export interface Ican {
  create?: [];
  read?: [];
  update?: [];
  delete?: [];
}

export interface IRoles extends mongoose.Document {
  name: string;
  description: string;
  can: Ican;
  createdBy?: string;
  lastUpdatedBy?: string;
}

const fixedEnum = {
  type: [String],
  enum: ["processograms", "privileges", "users", "all"],
};

const RoleSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    can: {
      create: fixedEnum,
      read: fixedEnum,
      update: fixedEnum,
      delete: fixedEnum,
    },
    createdBy: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
    lastUpdatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoles>("Role", RoleSchema);
