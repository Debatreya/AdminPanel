import mongoose, { Schema, Document } from 'mongoose';
import { SOCIETY_NAMES } from '../../constants/enums';

export type USER_ROLE = 'ADMIN' | 'CONVENOR';

export interface IUser extends Document {
  name: string;
  rollno: string;
  password: string;
  role: USER_ROLE;
  societyName?: SOCIETY_NAMES;
  imgurl: string; 
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    rollno: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },
    
    
    role: {
      type: String,
      enum: ['ADMIN', 'CONVENOR'],
      required: true
    },
    
    
    imgurl: {               
      type: String,
      required:true
    },
    societyName: {
      type: String,
      enum: Object.values(SOCIETY_NAMES),
      required: function () {
        return this.role === 'CONVENOR';
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
