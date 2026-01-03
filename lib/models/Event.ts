import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  society: mongoose.Types.ObjectId;
  societyID: string;
  societyName: string;

  events: Array<{
    imgurl: string;
  }>;
}

const EventSchema = new Schema<IEvent>({
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

  events: [{
    imgurl: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
