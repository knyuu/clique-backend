import nodemailer from 'nodemailer';

const mailer = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"clique83" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email đã được gửi tới: ${options.email}`);
        return info;
    } catch (error) {
        console.error('❌ Lỗi khi gửi mail:', error.message);
        throw new Error('Không thể gửi được email, vui lòng kiểm tra lại cấu hình SMTP.');
    }
};

export default mailer;