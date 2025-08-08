const Booth = require("../Models/Booth");

const Hall = require("../Models/Hall");

exports.createBooth = async (req, res) => {
  try {
    const { stallNumber, capacity, hall, availability } = req.body;
    const name = `${stallNumber}A`;

    const hallData = await Hall.findById(hall);
    if (!hallData) {
      return res.status(404).json({ message: "Hall not found" });
    }

    if (stallNumber < 1 || stallNumber > hallData.numberOfBooths) {
      return res.status(400).json({
        message: `Stall number must be between 1 and ${hallData.numberOfBooths}`
      });
    }

   
    const existingBooth = await Booth.findOne({ hall, stallNumber });
    if (existingBooth) {
      return res.status(400).json({
        message: `Stall number ${stallNumber} already exists in Hall ${hallData.hallNumber}`
      });
    }

    const booth = new Booth({
      stallNumber,
      name,
      capacity,
      hall,
      availability
    });

    await booth.save();
    res.status(201).json(booth);

  } catch (error) {
    res.status(500).json({ message: "Failed to create booth", error });
  }
};


exports.getAllBooths = async (req, res) => {
  try {
    const booths = await Booth.find().populate("hall", "hallNumber");
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booths", error });
  }
};

exports.getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id).populate("hall", "hallNumber");
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booth", error });
  }
};

exports.updateBooth = async (req, res) => {
  try {
    const { stallNumber, capacity, hall, availability } = req.body;
    const name = `${stallNumber}A`;

    // 🛑 Check for duplicate stall in same hall (excluding current booth)
    const existingBooth = await Booth.findOne({
      stallNumber,
      hall,
      _id: { $ne: req.params.id }
    });
    if (existingBooth) {
      return res.status(400).json({ message: "This stall number already exists in the selected hall" });
    }

    // 🛑 Check hall capacity limit
 
    const hallData = await Hall.findById(hall);
    if (!hallData) {
      return res.status(404).json({ message: "Hall not found" });
    }

    if (stallNumber > hallData.numberOfBooths) {
      return res.status(400).json({
        message: `Stall number must be between 1 and ${hallData.numberOfBooths}`
      });
    }

    const updated = await Booth.findByIdAndUpdate(
      req.params.id,
      { stallNumber, name, capacity, hall, availability },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booth", error });
  }
};


exports.deleteBooth = async (req, res) => {
  try {
    await Booth.findByIdAndDelete(req.params.id);
    res.json({ message: "Booth deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booth", error });
  }
};
