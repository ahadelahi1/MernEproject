const Exhibitor = require("../Models/Exhibitor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ✅ Exhibitor Register
exports.registerExhibitor = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Email already taken?
    const existing = await Exhibitor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // New Exhibitor with default status = pending
    const newExhibitor = new Exhibitor({
      name,
      email,
      password: hashedPassword,
      phone,
      status: "pending"
    });

    await newExhibitor.save();
    res.status(201).json({ message: "Exhibitor registered successfully. Await admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// ✅ Exhibitor Login (Only Active)
exports.loginExhibitor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exhibitor = await Exhibitor.findOne({ email });
    if (!exhibitor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Status check
    if (exhibitor.status !== "active") {
      return res.status(403).json({ message: "Account not active. Please wait for admin approval." });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, exhibitor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Token
    const token = jwt.sign(
      { id: exhibitor._id, role: "exhibitor" },
      "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({ token, exhibitor, message: "Login successfull"});
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// ✅ Get all Exhibitors (Admin only)
exports.getAllExhibitors = async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find();
    res.json(exhibitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exhibitors", error });
  }
};

// ✅ Update Exhibitor Status (Admin Approval)
exports.updateExhibitorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Exhibitor.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Exhibitor not found" });
    }
    res.json({ message: "Status updated successfully", exhibitor: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }

// newww





};


