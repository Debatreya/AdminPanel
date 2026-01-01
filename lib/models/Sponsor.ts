import mongoose, { Schema, Document } from 'mongoose';
import { SPONSOR_TYPES } from '../../constants/enums';

export interface ISponsor extends Document {
  sponsorType: SPONSOR_TYPES;
  sponsors: Array<{
    id: string;
    societyId: string;
    imgurl: string;
    title: string;
  }>;
}

const SponsorSchema: Schema = new Schema({
  sponsorType: {
    type: String,
    enum: Object.values(SPONSOR_TYPES),
    required: true
  },
  sponsors: [{
    id: {
      type: String,
      required: true
    },
    societyId: {
      type: String,
      required: true,
      ref: 'Society'
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
}, {
  timestamps: true
});

export default mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', SponsorSchema);
