import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

export interface ProductionModuleType extends mongoose.Document {
  name: string;
  description?: string;
  specie_id: mongoose.Types.ObjectId;
  creator_id?: mongoose.Types.ObjectId;
  processograms?: {
    identifier: string;
    raster_images: {
      [key: string]: string; // Key is the ID of the SVG element, value is the S3 URL
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductionModuleSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
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

ProductionModuleSchema.pre("validate", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name).toLowerCase();
  }
  next();
});

ProductionModuleSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update && update.name) {
    update.slug = slugify(update.name).toLowerCase();
  }
  next();
});

ProductionModuleSchema.virtual("processogramsCount", {
  ref: "Processogram",
  localField: "_id",
  foreignField: "production_module_id",
  count: true,
});

ProductionModuleSchema.virtual("processograms", {
  ref: "Processogram",
  localField: "_id",
  foreignField: "production_module_id",
});

// Create indexes for faster lookups
ProductionModuleSchema.index({ specie_id: 1 });

ProductionModuleSchema.index({ slug: 1, specie_id: 1 }, { unique: true });

export default mongoose.model<ProductionModuleType>(
  "ProductionModule",
  ProductionModuleSchema
);
