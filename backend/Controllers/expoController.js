const Expo = require("../Models/Expo");

const ExpoController = {
  // ✅ CREATE Expo
  Create: async (req, res) => {
    try {
      const { title, location, theme, startDate, endDate, description } = req.body;
      const expo = new Expo({ title, location, theme, startDate, endDate, description });
      await expo.save();
      res.status(201).json({ msg: "Expo Created", expo });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ GET ALL Expos
  GetAll: async (req, res) => {
    try {
      const expos = await Expo.find().sort({ createdAt: -1 });
      res.status(200).json(expos);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ GET Single Expo by ID
  GetOne: async (req, res) => {
    try {
      const expo = await Expo.findById(req.params.id);
      if (!expo) return res.status(404).json({ msg: "Expo not found" });
      res.status(200).json(expo);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ UPDATE Expo
  Update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, location, theme, startDate, endDate, description } = req.body;
      const updated = await Expo.findByIdAndUpdate(
        id,
        { title, location, theme, startDate, endDate, description },
        { new: true }
      );
      res.status(200).json({ msg: "Expo Updated", updated });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ DELETE Expo
  Delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Expo.findByIdAndDelete(id);
      res.status(200).json({ msg: "Expo Deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};





module.exports = ExpoController;
