import mongoose, { Schema, Document } from 'mongoose';
import { YEAR_LEVELS } from '../../constants/enums';

export interface ISociety extends Document {
  societyID: string;
  convenor: {
    year: YEAR_LEVELS;
    name: string;
    rollno: string;
    password: string;
    imgurl: string;
  };
  coConvenors: Array<{
    id: string;
    name: string;
    imgurl: string;
    year: YEAR_LEVELS;
  }>;
  logo: string;
}

const SocietySchema: Schema = new Schema({
  societyID: {
    type: String,
    required: true,
    unique: true
  },
  convenor: {
    year: {
      type: String,
      enum: Object.values(YEAR_LEVELS),
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rollno: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    imgurl: {
      type: String,
      required: true
    }
  },
  coConvenors: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    imgurl: {
      type: String,
      required: true
    },
    year: {
      type: String,
      enum: Object.values(YEAR_LEVELS),
      required: true
    }
  }],
  logo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Society || mongoose.model<ISociety>('Society', SocietySchema);
