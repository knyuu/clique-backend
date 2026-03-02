import jwt from 'jsonwebtoken';

const generateToken = async (res, userId) => {
    try {
        const token = jwt.sign(
            {
                id: userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        const isProduction = process.env.NODE_ENV === 'production';

        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? 'none' : 'lax',
        };

        res.cookie('token', token, cookieOptions);
        return token;
    } catch (error) {
        console.log("Error in generateToken: ", error)
    }
};

export default generateToken;