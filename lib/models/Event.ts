import mongoose, { Schema, Document } from 'mongoose';
import { SOCIETY_NAMES } from '../../constants/enums';

export interface IEvent extends Document {
  society: mongoose.Types.ObjectId;
  societyName: SOCIETY_NAMES;
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

  societyName: {
    type: String,
    enum: Object.values(SOCIETY_NAMES),
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
