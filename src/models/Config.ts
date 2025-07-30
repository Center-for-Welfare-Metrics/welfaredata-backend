import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  registrationCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema: Schema = new Schema(
  {
    registrationCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Config = mongoose.model<IConfig>('Config', ConfigSchema);
