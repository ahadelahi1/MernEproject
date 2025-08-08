const Expo = require("../Models/Expo");

const ExpoController = {

  Create: async (req, res) => {
    try {
      const { title, location, theme, startDate, endDate, description } = req.body;
      const expo = new Expo({ title, location, theme, startDate, endDate, description });
      await expo.save();
      res.status(201).json({ msg: "Expo Created", expo });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: err.message });

    }
  },

 
  GetAll: async (req, res) => {
    try {
      const expos = await Expo.find().sort({ createdAt: -1 });
      res.status(200).json(expos);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },


  GetOne: async (req, res) => {
    try {
      const expo = await Expo.findById(req.params.id);
      if (!expo) return res.status(404).json({ msg: "Expo not found" });
      res.status(200).json(expo);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

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
