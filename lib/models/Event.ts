import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  societyId: string;
  events: Array<{
    id: string;
    imgurl: string;
  }>;
}

const EventSchema: Schema = new Schema({
  societyId: {
    type: String,
    required: true,
    ref: 'Society'
  },
  events: [{
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

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
