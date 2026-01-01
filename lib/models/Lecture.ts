import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  societyId: string;
  lectures: Array<{
    id: string;
    imgurl: string;
  }>;
}

const LectureSchema: Schema = new Schema({
  societyId: {
    type: String,
    required: true,
    ref: 'Society'
  },
  lectures: [{
    id: {
      type: String,
      required: true
    },
    imgurl: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);
