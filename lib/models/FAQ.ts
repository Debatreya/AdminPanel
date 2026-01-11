import mongoose, { Schema, Document } from 'mongoose';
import { extend } from 'zod/mini';

export interface IFAQ extends Document {
    id: string;
    faq: string;
}

const faqSchema: Schema<IFAQ> = new Schema<IFAQ>(
    {
        id: {
            type: String,
            unique: true,
            auto: true,
            default: () => new Date().getTime().toString(),
        },
        faq: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.FAQ ||
    mongoose.model<IFAQ>('FAQ', faqSchema);