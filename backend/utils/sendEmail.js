import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  console.log("OTP received by sendOTPEmail:", otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();
  console.log("SMTP Connected ✅");

  //   await transporter.sendMail({
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     // subject: "Verify your email",
  //     subject: `OTP Test ${otp}`,
  //     html: `<h1>${otp}</h1>`,
  //   });

  await transporter.sendMail({
    from: `"Tina AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification Code",
    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; border:1px solid #e5e7eb; border-radius:10px;">
      
      <h2 style="color:#4f46e5; margin-bottom:20px;">
        Email Verification
      </h2>

      <p>Hello,</p>

      <p>
        Use the OTP below to verify your email address:
      </p>

      <div
        style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          text-align:center;
          background:#f3f4f6;
          padding:18px;
          border-radius:8px;
          margin:25px 0;
          color:#111827;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP is valid for <strong>5 minutes</strong>.
      </p>

      <p>
        If you didn't request this verification, you can safely ignore this email.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#6b7280;">
        This is an automated email. Please do not reply.
      </p>

    </div>
  `,
  });

  console.log("Email Sent ✅");
  console.log("OTP received by sendOTPEmail:", otp);
};
