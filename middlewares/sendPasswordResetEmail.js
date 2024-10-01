async function sendPasswordResetEmail(email, resetUrl){
    const recipient = [{ email }];
  
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Reset password request",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
        category: "Password Reset",
      });
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      throw new Error("Error sending password reset email: ", error);
    }
  };