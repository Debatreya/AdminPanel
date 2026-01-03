import mongoose, { Schema, Document } from 'mongoose';
import { SPONSOR_TYPES } from '../../constants/enums';

export interface ISponsor extends Document {
  sponsorType: SPONSOR_TYPES;

  sponsors: Array<{
    society: mongoose.Types.ObjectId;
    societyID: string;
    societyName: string;
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
