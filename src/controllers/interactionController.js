import Like from '../models/Like.js';
import Match from '../models/Match.js';

export const toggleLike = async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const { toUserId } = req.params;

        const existingLike = await Like.findOne({ fromUserId, toUserId });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ isLiked: false, isMatch: false });
        }

        await Like.create({ fromUserId, toUserId });

        const mutualLike = await Like.findOne({ fromUserId: toUserId, toUserId: fromUserId });

        if (mutualLike) {
            const [userA, userB] = [fromUserId, toUserId].sort();

            const newMatch = await Match.findOneAndUpdate(
                { userA, userB },
                {
                    userA,
                    userB,
                    status: 'waiting_for_userA',
                    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                },
                { upsert: true, new: true }
            );

            return res.status(200).json({
                isLiked: true,
                isMatch: true,
                matchId: newMatch._id
            });
        }

        res.status(200).json({ isLiked: true, isMatch: false });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xử lý Like", error: error.message });
    }
};