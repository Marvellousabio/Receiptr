import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: '',
  },
  logoUrl: {
    type: String,
    default: '',
  },
  selectedTemplate: {
    type: String,
    default: 'classic',
  },
  businesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  }],
  currentBusiness: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);