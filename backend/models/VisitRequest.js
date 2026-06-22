import mongoose from 'mongoose';

const visitRequestSchema = new mongoose.Schema(
  {
    visitorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hostUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    residenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    visitDate: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      trim: true,
      required: true,
    },
    lengthOfStay: {
      type: String,
      trim: true,
      required: true,
    },
    purpose: {
      type: String,
      trim: true,
      required: true,
    },
    guestCount: {
      type: String,
      trim: true,
      default: '1',
    },
    hostPreference: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const VisitRequest =
  mongoose.models.VisitRequest ||
  mongoose.model('VisitRequest', visitRequestSchema);

export default VisitRequest;
