import mongoose, { Schema } from "mongoose";

export interface ProductionModuleType extends mongoose.Document {
  name: string;
  description?: string;
  specie_id: mongoose.Types.ObjectId;
  creator_id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductionModuleSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
    creator_id: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
ProductionModuleSchema.index({ specie_id: 1 });

export default mongoose.model<ProductionModuleType>(
  "ProductionModule",
  ProductionModuleSchema
);
