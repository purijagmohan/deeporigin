
import mongoose, { Document, Schema } from 'mongoose';

interface UrlDocument extends Document {
  shortId: string;
  longUrl: string;
}

const UrlSchema: Schema<UrlDocument> = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true }
});

export default  mongoose.model<UrlDocument>('Url', UrlSchema);

