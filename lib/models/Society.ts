import mongoose, { Schema, Document, Types } from 'mongoose';
import { SOCIETY_NAMES } from '../../constants/enums';

export interface ISociety extends Document {
  name: SOCIETY_NAMES;   // fixed enum
  logo: string;

  // 🔒 Active convenor (authority)
  currentConvenor: {
    userId: Types.ObjectId;
    tech: number;        // e.g. 2024
  };

  // 👥 Active co-convenors (display only)
  currentCoConvenors: Array<{
    name: string;
    imgurl: string;
    tech: number;
  }>;

  // 🕰️ Convenor legacy
  convenorHistory: Array<{
    userId: Types.ObjectId;
    name: string;
    tech: number;
  }>;

  // 🕰️ Co-convenor legacy
  coConvenorHistory: Array<{
    name: string;
    imgurl: string;
    tech: number;
  }>;
}

const SocietySchema = new Schema<ISociety>(
  {
    name: {
      type: String,
      enum: Object.values(SOCIETY_NAMES),
      required: true,
      unique: true,
      index: true
    },

    logo: {
      type: String,
      required: true
    },

    currentConvenor: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      tech: {
        type: Number,
        required: true
      }
    },

    currentCoConvenors: [
      {
        name: { type: String, required: true },
        imgurl: { type: String, required: true },
        tech: { type: Number, required: true }
      }
    ],

    convenorHistory: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        name: { type: String, required: true },
        tech: { type: Number, required: true }
      }
    ],

    coConvenorHistory: [
      {
        name: { type: String, required: true },
        imgurl: { type: String, required: true },
        tech: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Society ||
  mongoose.model<ISociety>('Society', SocietySchema);
