import mongoose, { Schema, Document } from 'mongoose';
import { YEAR_LEVELS } from '../../constants/enums';

export interface IDeveloper extends Document {
  id: string;
  name: string;
  imgURL: string;
  year: YEAR_LEVELS;
  github: string;
  insta: string;
  linkedin: string;
}

const DeveloperSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
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
}, {
  timestamps: true
});

export default mongoose.models.Developer || mongoose.model<IDeveloper>('Developer', DeveloperSchema);
