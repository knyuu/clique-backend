import User from '../models/User.js';
import Like from '../models/Like.js';

export const getAllUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).lean();

        const myLikes = await Like.find({ fromUserId: currentUserId }).select('toUserId').lean();
        const excludeIds = myLikes.map(l => l.toUserId);
        excludeIds.push(currentUserId);

        const query = {
            _id: { $nin: excludeIds },
            isActivated: true
        };

        if (currentUser.genderPreference && currentUser.genderPreference !== 'Both') {
            query.gender = currentUser.genderPreference;
        }

        const potentialUsers = await User.find(query)
            .sort({ city: currentUser.city === 'Thành phố Hồ Chí Minh' ? -1 : 1 }) 
            .limit(20)
            .lean();

        res.status(200).json(potentialUsers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Discovery", error: error.message });
    }
};