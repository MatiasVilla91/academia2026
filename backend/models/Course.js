import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    description:  { type: String },
    price:        { type: Number },
    currency:     { type: String, default: 'BRL' },
    priceARS:     { type: Number },
    priceUSD:     { type: Number },
    language:     { type: String, enum: ['es', 'pt', 'en'] },
    slug:         { type: String, unique: true, required: true, index: true },
    instructor:   { type: String },
    rating:       { type: Number, min: 0, max: 5 },
    affiliationStatus: {
      type: String,
      enum: ['pending', 'open', 'approved', 'rejected', 'closed'],
      default: 'pending',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'tarot', 'baralho_cigano', 'chakras_energia', 'reiki', 'angeles',
        'numerologia_astrologia', 'meditacion', 'magia_plantas', 'otros',
      ],
      index: true,
    },
    imageUrl:     { type: String },
    hotmartId:    { type: String, unique: true, sparse: true },
    affiliateUrl: { type: String },
    sourceUrl:    { type: String },
    reviewsCount: { type: Number },
    workloadHours:{ type: Number },
    clickCount:   { type: Number, default: 0 },
    scrapedAt:    { type: Date },
    active:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Course', courseSchema);
