const Admin = require("../Models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, "your_jwt_secret", { expiresIn: "1d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// Default admin insert function
exports.createDefaultAdmin = async () => {
  const existing = await Admin.findOne({ email: "admin@admin.com" });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const newAdmin = new Admin({ email: "admin@admin.com", password: hashedPassword });
    await newAdmin.save();
    console.log("✅ Default admin created: admin@admin.com / 123456");
  } else {
    console.log("ℹ️ Admin already exists.");
  }
};
