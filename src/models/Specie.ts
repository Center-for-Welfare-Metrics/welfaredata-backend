import mongoose, { Schema } from "mongoose";

export interface SpecieType extends mongoose.Document {
  name: string;
  pathname: string;
  description?: string;
  creator_id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SpecieSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pathname: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    creator_id: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
SpecieSchema.index({ pathname: 1 }, { unique: true });
SpecieSchema.index({ name: 1 });

export default mongoose.model<SpecieType>("Specie", SpecieSchema);
