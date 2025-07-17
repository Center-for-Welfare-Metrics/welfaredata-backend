import mongoose, { Schema } from "mongoose";

type ImageEntry =
  | {
      url: string;
      source: "user-uploaded";
      uploaded_at: Date;
      s3_bucket_key: string;
    }
  | {
      url: string;
      source: "url-only";
      uploaded_at: Date;
    };

export interface IProcessogramImages extends mongoose.Document {
  specie_id: mongoose.Types.ObjectId;
  processogram_id: mongoose.Types.ObjectId;
  autoSearch: boolean;
  images: {
    [key: string]: ImageEntry[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcessogramImagesSchema: Schema = new mongoose.Schema(
  {
    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
    autoSearch: {
      type: Boolean,
      default: true,
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
