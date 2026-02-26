// ===============================
// VERIFY EMAIL TEMPLATE
// ===============================
export const verifyEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f0ee; margin: 0; padding: 40px 10px; }
    .wrapper { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .logo { color: #c0305e; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
    .content { color: #444; line-height: 1.6; }
    .token-box { background: #fdf0f4; border: 1px dashed #f5d5de; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
    .token { font-size: 32px; font-family: 'Courier New', monospace; font-weight: bold; color: #c0305e; letter-spacing: 6px; }
    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">clique83</div>
    <div class="content">
      <p>Xin chào <strong>{{NAME}}</strong> 👋,</p>
      <p>Chào mừng bạn gia nhập clique83. Vui lòng sử dụng mã xác thực dưới đây để hoàn tất quá trình đăng ký:</p>
      
      <div class="token-box">
        <div class="token">{{TOKEN}}</div>
        <p style="margin-top: 10px; font-size: 13px; color: #666;">Mã có hiệu lực trong 15 phút</p>
      </div>

      <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể an tâm bỏ qua email này.</p>
    </div>
    <div class="footer">
      © 2026 clique83 • Kết nối những tâm hồn đồng điệu
    </div>
  </div>
</body>
</html>
`;

// ===============================
// WELCOME EMAIL TEMPLATE
// ===============================
export const welcomeEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f0ee; margin: 0; padding: 40px 10px; }
    .wrapper { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; }
    .header-icon { font-size: 50px; margin-bottom: 10px; }
    h2 { color: #1a1a1a; margin-bottom: 10px; }
    .steps-container { text-align: left; margin: 30px 0; }
    .step { background: #fdf0f4; border-radius: 12px; padding: 15px 20px; margin-bottom: 15px; border-left: 4px solid #c0305e; }
    .step-title { font-weight: bold; color: #c0305e; display: block; margin-bottom: 4px; }
    .btn { display: inline-block; background: #c0305e; color: #ffffff !important; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-icon">🎉</div>
    <h2>Chào mừng {{NAME}}!</h2>
    <p style="color: #666;">Tài khoản của bạn đã sẵn sàng. Hãy bắt đầu hành trình ngay bây giờ:</p>

    <div class="steps-container">
      <div class="step">
        <span class="step-title">1. Hoàn thiện hồ sơ</span>
        <span style="font-size: 14px; color: #555;">Thêm những bức ảnh lung linh nhất và mô tả thú vị về bạn.</span>
      </div>
      <div class="step">
        <span class="step-title">2. Khám phá gợi ý</span>
        <span style="font-size: 14px; color: #555;">Hệ thống sẽ tìm những người phù hợp với tính cách của bạn.</span>
      </div>
    </div>

    <a href="http://localhost:3000/login" class="btn">Trải nghiệm ngay</a>
    
    <p style="font-size: 12px; color: #aaa; margin-top: 30px;">© 2026 clique83</p>
  </div>
</body>
</html>
`;