import mongoose, { Schema } from "mongoose";

export interface ISvgElement extends mongoose.Document {
  identifier: string; // The ID extracted from SVGElement
  specie_id: string; // Reference to the Specie model
  root_id: mongoose.Types.ObjectId | null; // Reference to the root SVG element
  element_type: "root" | "element"; // Type of element - root is the SVG itself, element is a child
  name: string; // From data-name attribute
  levelName: string; // From data-level-name attribute
  normalized_name: string; // Will be populated later
  description: string; // Will be populated later
  svg_url?: string; // URL to the SVG file, only for root elements
  status: "processing" | "ready" | "error"; // Status of the SVG processing
  raster_images: {
    // Object where key is the ID of svgelement and value is S3 URL
    [key: string]: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SvgElementSchema: Schema = new mongoose.Schema(
  {
    identifier: { type: String, required: false },
    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
    root_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SvgElement",
      required: false, // Can be null for root elements
    },
    element_type: {
      type: String,
      enum: ["root", "element"],
      required: true,
      default: "element",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "processing",
    },
    name: { type: String, required: true },
    levelName: { type: String, required: false },
    normalized_name: { type: String, required: false },
    description: { type: String, required: false },
    svg_url: { type: String, required: false },
    raster_images: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

SvgElementSchema.index({ specie_id: 1, element_type: 1, root_id: 1 });

export default mongoose.model<ISvgElement>("SvgElement", SvgElementSchema);
