import mongoose, { Schema, SchemaTypeOptions } from "mongoose";

export interface IMedia {
  _id?: mongoose.Types.ObjectId;
  originalName?: SchemaTypeOptions<any> | Schema | string;
  url: SchemaTypeOptions<any> | Schema | string;
  size?: SchemaTypeOptions<any> | Schema | number;
  type: SchemaTypeOptions<any> | Schema | string;
  name?: SchemaTypeOptions<any> | Schema | string;
  descripition?: SchemaTypeOptions<any> | Schema | string;
}

export const MediaSchema: IMedia = {
  originalName: { type: String },
  url: { type: String, required: true },
  size: { type: Number },
  type: { type: String, required: true },
  name: { type: String },
  descripition: { type: String },
};

export interface ICommonInformations {
  name: SchemaTypeOptions<any> | Schema | string;
  description: SchemaTypeOptions<any> | Schema | string;
  medias: SchemaTypeOptions<any> | Schema | IMedia[];
}

const CommonInformations: ICommonInformations = {
  name: { type: String, required: false },
  description: { type: String, required: false },
  medias: [MediaSchema],
};

export interface IProcessogram extends mongoose.Document {
  name?: string;
  description: string;
  specie: string;
  productionSystem: string;
  lifefates?: any[];
  phases?: any[];
  circumstances?: any[];
  medias: IMedia[];
}

const ProcessogramSchema: Schema = new mongoose.Schema(
  {
    specie: { type: String, required: true, ref: "Specie" },
    productionSystem: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ProductionSystem",
    },
    ...CommonInformations,
    lifefates: [
      {
        lifeFate: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "LifeFate",
        },
        ...CommonInformations,
        phases: [
          {
            phase: {
              type: mongoose.Types.ObjectId,
              required: true,
              ref: "Phase",
            },
            ...CommonInformations,
            circumstances: [
              {
                circumstance: {
                  type: mongoose.Types.ObjectId,
                  required: true,
                  ref: "Circumstance",
                },
                ...CommonInformations,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model<IProcessogram>(
  "Processogram",
  ProcessogramSchema
);
