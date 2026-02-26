import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, { timestamps: true });

likeSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

likeSchema.index({ toUserId: 1, fromUserId: 1 });

export default mongoose.model('Like', likeSchema);