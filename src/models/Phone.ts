import mongoose, { Schema, Document } from "mongoose";

export interface IPhone extends Document {
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  isNew: boolean;
}

const phoneSchema = new Schema<IPhone>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    isNewPhone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Phone =
  mongoose.models.Phone ||
  mongoose.model<IPhone>("Phone", phoneSchema);

export default Phone;