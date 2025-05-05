import mongoose, { Schema } from "mongoose";

interface DataEntry {
  id: string;
  level: string;
  name: string;
  description: string;
  duration_label: string;
  duration_in_seconds: number;
}

export interface IProcessogramQuestion extends mongoose.Document {
  production_system_name: string;
  svg_element_id: mongoose.Types.ObjectId;
  specie_id: mongoose.Types.ObjectId;
  data: {
    [key: string]: DataEntry;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcessogramQuestionSchema: Schema = new mongoose.Schema(
  {
    production_system_name: { type: String, required: true },
    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
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

ProcessogramQuestionSchema.index({ svg_element_id: 1 });

export const ProcessogramQuestionModel = mongoose.model<IProcessogramQuestion>(
  "ProcessogramQuestion",
  ProcessogramQuestionSchema
);
