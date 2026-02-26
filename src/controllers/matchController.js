import Like from '../models/Like.js';
import Match from '../models/Match.js';
import Availability from '../models/Availability.js';

export const toggleLike = async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const { toUserId } = req.body;

        const existingLike = await Like.findOne({ fromUserId, toUserId });
        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ isLiked: false, isMatch: false });
        }

        await Like.create({ fromUserId, toUserId });

        const mutualLike = await Like.findOne({ fromUserId: toUserId, toUserId: fromUserId });

        if (mutualLike) {
            const [userA, userB] = [fromUserId, toUserId].sort();
            const triggerUser = fromUserId === userA.toString() ? 'userA' : 'userB';

            const initialStatus = triggerUser === 'userA' ? 'waiting_for_userB' : 'waiting_for_userA';

            const match = await Match.findOneAndUpdate(
                { userA, userB },
                {
                    status: initialStatus,
                    expiresAt: new Date(Date.now() + 48 * 3600000)
                },
                { upsert: true, new: true }
            );

            await Like.deleteMany({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });

            return res.status(200).json({ isLiked: true, isMatch: true, matchId: match._id });
        }

        res.status(200).json({ isLiked: true, isMatch: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const submitAvailability = async (req, res) => {
    try {
        const { matchId, slots } = req.body;
        const userId = req.user.id;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: "Match không tồn tại" });

        await Availability.findOneAndUpdate(
            { matchId, userId },
            { slots },
            { upsert: true }
        );

        const nextStatus = match.userA.toString() === userId ? 'waiting_for_userB' : 'waiting_for_userA';
        match.status = nextStatus;
        await match.save();

        res.status(200).json({ message: "Đã ghi nhận lịch, chờ đối phương phản hồi!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- FINAL CHECK ---
export const finalizeMatch = async (req, res) => {
    try {
        const { matchId, slots: mySlots } = req.body;
        const myId = req.user.id;

        const partnerAvail = await Availability.findOne({ matchId, userId: { $ne: myId } });
        if (!partnerAvail) return res.status(400).json({ message: "Đối phương chưa nộp lịch" });

        let commonSlot = null;
        const MIN_DURATION = 60 * 60 * 1000;

        for (let sA of partnerAvail.slots) {
            for (let sB of mySlots) {
                const start = Math.max(new Date(sA.start), new Date(sB.start));
                const end = Math.min(new Date(sA.end), new Date(sB.end));

                if (end - start >= MIN_DURATION) {
                    commonSlot = { start: new Date(start), end: new Date(end) };
                    break;
                }
            }
            if (commonSlot) break;
        }

        const match = await Match.findById(matchId);
        if (commonSlot) {
            match.status = 'scheduled';
            match.finalSlot = commonSlot;
            match.expiresAt = undefined;
            await match.save();
            return res.status(200).json({ status: 'success', finalSlot: commonSlot });
        } else {
            match.status = 'no_common_slot';
            await match.save();
            return res.status(200).json({ status: 'fail', message: "Không tìm thấy giờ chung" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActionRequired = async (req, res) => {
    try {
        const myId = req.user.id;
        const likes = await Like.find({ toUserId: myId })
            .populate('fromUserId', 'name avatar city age gender bio')
            .lean();
        res.status(200).json(likes.map(l => l.fromUserId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingLikes = async (req, res) => {
    try {
        const myId = req.user.id;
        const myLikes = await Like.find({ fromUserId: myId })
            .populate('toUserId', 'name avatar city age gender bio')
            .lean();
        res.status(200).json(myLikes.map(l => l.toUserId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingSchedules = async (req, res) => {
    try {
        const myId = req.user.id;
        const matches = await Match.find({
            $or: [{ userA: myId }, { userB: myId }],
            status: { $in: ['waiting_for_userA', 'waiting_for_userB', 'no_common_slot'] }
        }).populate('userA userB').lean();

        const result = matches.map(m => {
            const isMyTurn = (m.status === `waiting_for_user${m.userA._id.toString() === myId ? 'A' : 'B'}`);
            const partner = m.userA._id.toString() === myId ? m.userB : m.userA;
            return { ...m, partner, isMyTurn };
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyDates = async (req, res) => {
    try {
        const myId = req.user.id;
        const dates = await Match.find({
            $or: [{ userA: myId }, { userB: myId }],
            status: 'scheduled'
        }).populate('userA userB').lean();
        res.status(200).json(dates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};