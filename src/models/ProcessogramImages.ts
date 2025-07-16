import mongoose, { Schema } from "mongoose";

interface ImageEntry {
  id: string;
  filename: string;
  url: string;
  file_type: string;
  file_size: number;
  uploaded_at: Date;
}

export interface IProcessogramImages extends mongoose.Document {
  production_system_name: string;
  processogram_id: mongoose.Types.ObjectId;
  specie_id: mongoose.Types.ObjectId;
  images: {
    [key: string]: ImageEntry;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcessogramImagesSchema: Schema = new mongoose.Schema(
  {
    production_system_name: { type: String, required: true },
    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
    processogram_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processogram",
      required: true,
    },
    images: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ProcessogramImagesSchema.index({ processogram_id: 1 });

export const ProcessogramImagesModel = mongoose.model<IProcessogramImages>(
  "ProcessogramImages",
  ProcessogramImagesSchema
);
