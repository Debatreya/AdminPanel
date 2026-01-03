import mongoose, { Schema, Document } from 'mongoose';
import { SOCIETY_NAMES } from '../../constants/enums';

export interface ILecture extends Document {
  society: mongoose.Types.ObjectId;
  societyName: SOCIETY_NAMES;
  lectures: Array<{
    imgurl: string;
  }>;
}

const LectureSchema = new Schema<ILecture>({
  society: {
    type: Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
    index: true
  },

  societyName: {
    type: String,
    enum: Object.values(SOCIETY_NAMES),
    required: true,
    index: true
  },

  lectures: [{
    imgurl: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

export default mongoose.models.Lecture ||
  mongoose.model<ILecture>('Lecture', LectureSchema);
