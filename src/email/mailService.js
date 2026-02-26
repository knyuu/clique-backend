import mailer from './mailer.js';
import { verifyEmailTemplate, welcomeEmailTemplate } from './emailTemplates.js';

export const sendActivationEmail = async (user, otpCode) => {
    try {
        const htmlContent = verifyEmailTemplate
            .replace('{{NAME}}', user.name)
            .replace('{{TOKEN}}', otpCode);

        await mailer({
            email: user.email,
            subject: 'Xác thực tài khoản của bạn - clique83',
            message: htmlContent
        });
        console.log(`📩 OTP đã được gửi đến: ${user.email}`);
    } catch (error) {
        console.error("❌ Error when sending verify email:", error.message);
    }
    return true;
};

export const sendWelcomeEmail = async (user) => {
    try {
        const htmlContent = welcomeEmailTemplate.replace('{{NAME}}', user.name);
        await mailer({
            email: user.email,
            subject: '🎉 Chào mừng bạn đến với clique83!',
            message: htmlContent
        });
    } catch (error) {
        console.error("❌ Error when sending welcome email:", error.message);
    }
};