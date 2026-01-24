import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
  slug: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},
  name: { type: String, required: true }, // Banarasi, Straight, etc.
  image: { type: String, required: true },
  category: { type: String, required: true }, // saree, kurta, suit
}, { timestamps: true });

const Type = mongoose.model('Type', typeSchema);

export default Type;
