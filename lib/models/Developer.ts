import mongoose, { Schema, Document } from 'mongoose';
import { YEAR_LEVELS, DEVELOPER_ROLES } from '../../constants/enums';

export interface IDeveloper extends Document {
  name: string;
  imgURL: string;
  year: YEAR_LEVELS;
  role: DEVELOPER_ROLES;
  github: string;
  insta: string;
  linkedin: string;
}

const DeveloperSchema = new Schema<IDeveloper>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    imgURL: {
      type: String,
      required: true
    },

    year: {
      type: String,
      enum: Object.values(YEAR_LEVELS),
      required: true
    },

    role: {
      type: String,
      enum: Object.values(DEVELOPER_ROLES),
      required: true
    },

    github: {
      type: String,
      required: true
    },

    insta: {
      type: String,
      required: true
    },

    linkedin: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Developer ||
  mongoose.model<IDeveloper>('Developer', DeveloperSchema);
