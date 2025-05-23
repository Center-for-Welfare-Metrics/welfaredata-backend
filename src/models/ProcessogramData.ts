import mongoose, { Schema } from "mongoose";

interface DataEntry {
  id: string;
  level: string;
  name: string;
  description: string;
  duration_label: string;
  duration_in_seconds: number;
}

export interface IProcessogramData extends mongoose.Document {
  production_system_name: string;
  svg_element_id: mongoose.Types.ObjectId;
  specie_id: mongoose.Types.ObjectId;
  data: {
    [key: string]: DataEntry;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcessogramDataSchema: Schema = new mongoose.Schema(
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
    data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ProcessogramDataSchema.index({ svg_element_id: 1 });

export const ProcessogramDataModel = mongoose.model<IProcessogramData>(
  "ProcessogramData",
  ProcessogramDataSchema
);
