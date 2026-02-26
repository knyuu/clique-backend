import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) return res.status(404).json({ message: "User not found!" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        const { name, bio, city, gender, genderPreference, age } = req.body;

        if (!name || !bio || !city || !gender || !genderPreference || !age) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các trường thông tin bắt buộc!"
            });
        }

        if (name.trim().length < 2) return res.status(400).json({ message: "Tên quá ngắn!" });
        if (bio.trim().length < 10) return res.status(400).json({ message: "Giới thiệu bản thân cần ít nhất 10 ký tự!" });

        const ageNum = Number(age);
        if (isNaN(ageNum) || ageNum < 18) {
            return res.status(400).json({ message: "Tuổi không hợp lệ hoặc bạn chưa đủ 18 tuổi!" });
        }

        if (!user.avatar && !req.file) {
            return res.status(400).json({ message: "Vui lòng tải lên ảnh đại diện!" });
        }

        user.name = name.trim();
        user.bio = bio.trim();
        user.city = city.trim();
        user.gender = gender;
        user.genderPreference = genderPreference;
        user.age = ageNum;

        if (req.file) {
            user.avatar = req.file.path;
        }

        user.hasCompletedOnboarding = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Hồ sơ đã được cập nhật hoàn tất!",
            user: {
                name: user.name,
                avatar: user.avatar,
                isActivated: user.isActivated,
                hasCompletedOnboarding: user.hasCompletedOnboarding
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
    }
};