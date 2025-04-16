import mongoose, { Schema } from "mongoose";
import { ISvgElement } from "./SvgElement";

interface DataEntry {
  id: string;
  level: string;
  name: string;
  description: string;
  duration_label: string;
  duration_in_seconds: number;
}

export interface ISvgData extends mongoose.Document {
  production_system_name: string;
  svg_element_id: mongoose.Types.ObjectId | ISvgElement;
  data: {
    [key: string]: DataEntry;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SvgDataSchema: Schema = new mongoose.Schema(
  {
    production_system_name: { type: String, required: true },
    svg_element_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SvgElement",
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

SvgDataSchema.index({ svg_element_id: 1 });

export default mongoose.model<ISvgData>("SvgData", SvgDataSchema);
