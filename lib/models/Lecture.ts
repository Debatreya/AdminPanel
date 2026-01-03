import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  society: mongoose.Types.ObjectId;
  societyID: string;
  societyName: string;

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

  societyID: {
    type: String,
    required: true,
    index: true
  },

  societyName: {
    type: String,
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
