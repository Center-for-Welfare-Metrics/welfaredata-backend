import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

export interface IProcessogram extends mongoose.Document {
  identifier: string; // The ID extracted from SVGElement

  specie_id: string; // Reference to the Specie model
  production_module_id: mongoose.Types.ObjectId; // Reference to the ProductionModule model

  name: string; // From data-name attribute
  levelName: string; // From data-level-name attribute
  normalized_name: string; // Will be populated later
  description: string; // Will be populated later

  is_published: boolean; // Whether the processogram is published

  svg_url_light: string;
  svg_bucket_key_light: string; // S3 bucket key for the light SVG
  original_name_light: string;
  original_size_light: number; // Original size of the SVG in light
  final_size_light: number; // Final size of the SVG in light after processing
  raster_images_light: {
    // Object where key is the ID of svgelement and value is S3 URL
    [key: string]: {
      src: string;
      bucket_key: string;
      width: number;
      height: number;
      x: number;
      y: number;
    };
  };

  svg_url_dark: string;
  svg_bucket_key_dark: string; // S3 bucket key for the dark SVG
  original_name_dark: string;
  original_size_dark: number; // Original size of the SVG in dark
  final_size_dark: number; // Final size of the SVG in dark after processing
  raster_images_dark: {
    // Object where key is the ID of svgelement and value is S3 URL
    [key: string]: {
      src: string;
      bucket_key: string;
      width: number;
      height: number;
      x: number;
      y: number;
    };
  };

  status: "processing" | "ready" | "error" | "generating"; // Status of the SVG processing
  errorMessage?: string; // Error message if status is error

  // Timestamps for creation and updates
  createdAt: Date;
  updatedAt: Date;
}

const ProcessogramSchema: Schema = new mongoose.Schema(
  {
    identifier: { type: String, required: false },

    slug: { type: String, required: true },

    specie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specie",
      required: true,
    },
    production_module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionModule",
      required: true,
    },

    is_published: {
      type: Boolean,
      default: false,
      required: false,
    },

    status: {
      type: String,
      enum: ["processing", "ready", "error", "generating"],
      default: "processing",
    },
    errorMessage: {
      type: String,
      required: false,
    },

    errorContext: {
      type: Object,
      required: false,
    },

    name: { type: String, required: true },
    levelName: { type: String, required: false },
    normalized_name: { type: String, required: false },
    description: { type: String, required: false },

    svg_url_light: { type: String, required: false },
    svg_bucket_key_light: { type: String, required: false },
    original_name_light: { type: String, required: false },
    original_size_light: { type: Number, required: false },
    final_size_light: { type: Number, required: false },
    raster_images_dark: {
      type: Object,
      default: {},
    },

    svg_url_dark: { type: String, required: false },
    svg_bucket_key_dark: { type: String, required: false },
    original_name_dark: { type: String, required: false },
    original_size_dark: { type: Number, required: false },
    final_size_dark: { type: Number, required: false },
    raster_images_light: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ProcessogramSchema.pre("validate", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name).toLowerCase();
  }
  next();
});

ProcessogramSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update && update.name) {
    update.slug = slugify(update.name).toLowerCase();
  }
  next();
});

ProcessogramSchema.index({ specie_id: 1, element_type: 1, root_id: 1 });

ProcessogramSchema.index(
  { production_module_id: 1, slug: 1 },
  { unique: true }
);
ProcessogramSchema.index({ production_module_id: 1 });

export const ProcessogramModel = mongoose.model<IProcessogram>(
  "Processogram",
  ProcessogramSchema
);
