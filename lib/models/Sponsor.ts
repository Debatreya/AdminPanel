import mongoose, { Schema, Document } from 'mongoose';
import { SPONSOR_TYPES, SOCIETY_NAMES } from '../../constants/enums';

export interface ISponsor extends Document {
  sponsorType: SPONSOR_TYPES;

  sponsors: Array<{
    society: mongoose.Types.ObjectId;
    societyName: SOCIETY_NAMES;
    imgurl: string;
    title: string;
  }>;
}

const SponsorSchema = new Schema<ISponsor>({
  sponsorType: {
    type: String,
    enum: Object.values(SPONSOR_TYPES),
    required: true,
    index: true
  },

  sponsors: [{
    society: {
      type: Schema.Types.ObjectId,
      ref: 'Society',
      required: true
    },
    societyName: {
      type: String,
      enum: Object.values(SOCIETY_NAMES),
      required: true,
      index: true
    },
    imgurl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

export default mongoose.models.Sponsor ||
  mongoose.model<ISponsor>('Sponsor', SponsorSchema);
