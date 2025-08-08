const Booth = require("../Models/Booth");

exports.createBooth = async (req, res) => {
  try {
    const { stallNumber, capacity, hall, availability } = req.body;
    const name = `${stallNumber}A`;

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
