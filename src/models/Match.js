import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({

  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: [
      'waiting_for_userA',
      'waiting_for_userB',
      'scheduled',
      'no_common_slot',
      'expired'
    ],
    default: 'waiting_for_userA',
    index: true
  },

  finalSlot: {
    start: Date,
    end: Date
  },

  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }

}, { timestamps: true });

matchSchema.index(
  { userA: 1, userB: 1 },
  { unique: true }
);

export default mongoose.model('Match', matchSchema);