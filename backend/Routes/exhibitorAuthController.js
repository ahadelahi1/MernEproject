const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Exhibitor = require("../Models/Exhibitor"); // apna Exhibitor model import karo
const nodemailer = require("nodemailer");

// Forget Password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const exhibitor = await Exhibitor.findOne({ email });

    if (!exhibitor) {
      return res.status(404).json({ message: "Exhibitor not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    exhibitor.resetPasswordToken = resetToken;
    exhibitor.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await exhibitor.save();

    // Reset URL
    const resetUrl = `http://localhost:3000/exhibitor-reset/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSKEY,
      },
    });

    await transporter.sendMail({
      from: `"EventSphere" <${process.env.EMAIL}>`,
      to: exhibitor.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset</p>
             <p>Click this link to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.json({ message: "Reset password link sent to email ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const exhibitor = await Exhibitor.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!exhibitor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    exhibitor.password = await bcrypt.hash(newPassword, salt);

    // Clear token fields
    exhibitor.resetPasswordToken = undefined;
    exhibitor.resetPasswordExpire = undefined;

    await exhibitor.save();

    res.json({ message: "Password reset successful ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
