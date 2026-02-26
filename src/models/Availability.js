import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({

    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    slots: [
        {
            start: { type: Date, required: true },
            end: { type: Date, required: true }
        }
    ],

    submittedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

availabilitySchema.index(
    { matchId: 1, userId: 1 },
    { unique: true }
);

export default mongoose.model('Availability', availabilitySchema);