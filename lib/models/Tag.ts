import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  id: string;
  tag: string;
}

const TagSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  tag: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
