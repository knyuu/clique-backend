import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const protect = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }

    let token;
    token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};