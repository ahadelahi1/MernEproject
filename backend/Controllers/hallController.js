const Hall = require('../Models/Hall');


// Add Hall
exports.addHall = async (req, res) => {
  try {
    const { hallNumber, numberOfBooths, expoId } = req.body;
    console.log("📥 Incoming Add Hall Request Body:", req.body);

    // 🛑 Duplicate hall check within the same expo
    const existingHall = await Hall.findOne({ hallNumber, expoId });
    if (existingHall) {
      return res.status(400).json({ 
        message: `Hall ${hallNumber} is already added in the selected expo` 
      });
    }

    const newHall = new Hall({ hallNumber, numberOfBooths, expoId });
    await newHall.save();
    res.status(201).json(newHall);

  } catch (error) {
    console.log("❌ Add Hall Error:", error);
    res.status(500).json({ message: 'Failed to add hall', error: error.message });
  }
};



// Get All Halls
exports.getHalls = async (req, res) => {
  try {
    const halls = await Hall.find().populate('expoId', 'title');
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch halls', error });
  }
};

// Get Single Hall
exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hall', error });
  }
};


// Update Hall
exports.updateHall = async (req, res) => {
  try {
    const { hallNumber, numberOfBooths, expoId } = req.body;

    // 🛑 Duplicate hall check in same expo, ignoring the current hall's own ID
    const existingHall = await Hall.findOne({
      hallNumber,
      expoId,
      _id: { $ne: req.params.id }
    });

    if (existingHall) {
      return res.status(400).json({
        message: `Hall ${hallNumber} is already added in the selected expo`
      });
    }

    const updated = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to update hall', error: error.message });
  }
};


// Delete Hall
exports.deleteHall = async (req, res) => {
  try {
    await Hall.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hall deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete hall', error });
  }
};
