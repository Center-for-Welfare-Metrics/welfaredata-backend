import mongoose, { Schema } from "mongoose";

export interface SpecieType extends mongoose.Document {
  name: string;
  pathname: string;
  description?: string;
  creator_id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  //Virtual fields
  processogramsCount?: number;
  productionModulesCount?: number;
  processograms?: {
    identifier: string;
    raster_images: {
      [key: string]: string; // Key is the ID of the SVG element, value is the S3 URL
    };
  }[];
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

SpecieSchema.virtual("processogramsCount", {
  ref: "Processogram",
  localField: "_id",
  foreignField: "specie_id",
  count: true,
});

SpecieSchema.virtual("productionModulesCount", {
  ref: "Processogram",
  localField: "_id",
  foreignField: "specie_id",
  count: true,
});

SpecieSchema.virtual("processograms", {
  ref: "Processogram",
  localField: "_id",
  foreignField: "specie_id",
});

SpecieSchema.set("toObject", { virtuals: true });
SpecieSchema.set("toJSON", { virtuals: true });

// Create indexes for faster lookups
SpecieSchema.index({ pathname: 1 }, { unique: true });
SpecieSchema.index({ name: 1 });

export default mongoose.model<SpecieType>("Specie", SpecieSchema);
