const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    // ✅ Pehla login → admin banega
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new Admin({ email, password: hashedPassword });
      await admin.save();

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, message: "First admin registered successfully" });
    }

    // ✅ Agar admin exist karta hai → normal login
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, message: "Login successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error });
  }
};
