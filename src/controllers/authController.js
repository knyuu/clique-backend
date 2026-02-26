import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import * as mailService from '../email/mailService.js';

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const randomAvatar = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email)}`;
        const avatarUrl = req.file ? req.file.path : randomAvatar;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: avatarUrl,
            activationToken: otpCode,
            activationTokenExpires: Date.now() + 15 * 60 * 1000
        });

        await mailService.sendActivationEmail(user, otpCode);

        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Hãy kiểm tra mã OTP trong email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// --- VERIFY OTP ---
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            activationToken: otp,
            activationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Mã xác thực không đúng hoặc đã hết hạn." });
        }

        user.isActivated = true;
        user.activationToken = undefined;
        user.activationTokenExpires = undefined;
        await user.save();

        const token = await generateToken(res, user._id);

        mailService.sendWelcomeEmail(user);

        res.status(200).json({ message: "Tài khoản đã kích hoạt và đăng nhập thành công!", token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- RESEND OTP---
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        if (user.isActivated) return res.status(400).json({ message: "Tài khoản đã được xác thực" });

        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.activationToken = newOtpCode;
        user.activationTokenExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await mailService.sendActivationEmail(user, newOtpCode);

        res.status(200).json({ message: "Mã OTP mới đã được gửi!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và mật khẩu" });
        }

        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            await generateToken(res, user._id);
            res.json({
                success: true,
                message: "Loggin Success!",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isActivated: user.isActivated,
                    hasCompletedOnboarding: user.hasCompletedOnboarding
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// --- LOGOUT ---
export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};