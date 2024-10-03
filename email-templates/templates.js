const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OnwE</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
  <div style="background-color: #1a1a1a; padding: 20px; text-align: center; display: flex; justify-items:space-between; align-items: center; flex-direction: row; justify-content: space-between;">
    <h1>ONWE</h1>
    <h3 style="color: white; margin: 0;">Verify Your Email</h3>
  </div>
  <div style="background-color: #333; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);">
    <p>Hello 🫡,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #fff;">{verificationCode}</span>
    </div>
    <div style="text-align: center;">
    <p>Enter this code on the verification page to complete your registration. 💻</p>
    <p>This code will expire in 15 minutes for security reasons 🕜.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
  </div>
  <br>
    <p>Best regards,<br>Team <strong>ONWE</strong></p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const SIGNUP_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signup Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
  <div style="background-color: #1a1a1a; padding: 20px; text-align: center; display: flex; justify-items: space-between; align-items: center; flex-direction: row; justify-content: space-between;">
    <h1>ONWE</h1>
    <h3 style="color: white; margin: 0;">Signup Successful</h3>
  </div>
  <div style="background-color: #333; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);">
    <p>Hello {userName},</p>
    <p>Thank you for signing up with OnwE! Your account has been successfully created.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: white; color: green; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>We're excited to have you on board! You can now log in and start using your account.</p>
    <p>Best regards,<br>OnwE Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;




const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
  <div style="background-color: #1a1a1a; padding: 20px; text-align: center; display: flex; justify-items:space-between; align-items: center; flex-direction: row; justify-content: space-between;">
    <h1>ONWE</h1>
    <h3 style="color: white; margin: 0;">Password Reset Successful</h3>
  </div>
  <div style="background-color: #333; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: white; color: green; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>OnwE Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP for resetting your password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
    <h1 style="text-align: center;">ONWE</h1>
  <div style="background-color: #333; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below and enter the OTP shown above:</p>
    <div style="text-align: center; margin: 30px 0;">
      <h1>{otp}</h1>
    </div>
    <p>This link will expire in 10 minutes for security reasons.</p>
  
    <p>Best regards,<br>Team <strong>ONWE</strong></p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

module.exports = { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE,SIGNUP_SUCCESS_TEMPLATE };
