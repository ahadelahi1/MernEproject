const fs = require("fs");
const path = require("path");
const Expo = require("../Models/Expo");

const ExpoController = {

  Create: async (req, res) => {
    try {
      const { title, location, theme, startDate, endDate, description } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!title || !location || !theme || !startDate || !endDate) {
        return res.status(400).json({ msg: "All required fields must be filled" });
      }

      const expo = new Expo({
        title,
        location,
        theme,
        startDate,
        endDate,
        description,
        image
      });

      await expo.save();
      res.status(201).json({ msg: "Event Created", expo });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  GetAll: async (req, res) => {
    try {
      const { search, startDate, endDate, theme } = req.query;
      let filter = {};

      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      if (startDate && endDate) {
        filter.startDate = { $gte: new Date(startDate) };
        filter.endDate = { $lte: new Date(endDate) };
      }

      if (theme) {
        filter.theme = { $regex: theme, $options: "i" };
      }

      const expos = await Expo.find(filter).sort({ createdAt: -1 });
      res.status(200).json(expos);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  GetOne: async (req, res) => {
    try {
      const expo = await Expo.findById(req.params.id);
      if (!expo) return res.status(404).json({ msg: "Event not found" });
      res.status(200).json(expo);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  Update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, location, theme, startDate, endDate, description } = req.body;

      const expo = await Expo.findById(id);
      if (!expo) return res.status(404).json({ msg: "Event not found" });

      let image = expo.image;

      // Agar nayi image upload hui hai
      if (req.file) {
        // Purani image delete karo
        if (expo.image) {
          const oldImagePath = path.join(__dirname, "..", "uploads", expo.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        image = req.file.filename;
      }

      expo.title = title;
      expo.location = location;
      expo.theme = theme;
      expo.startDate = startDate;
      expo.endDate = endDate;
      expo.description = description;
      expo.image = image;

      await expo.save();
      res.status(200).json({ msg: "Event Updated", expo });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  Delete: async (req, res) => {
    try {
      const { id } = req.params;
      const expo = await Expo.findById(id);
      if (!expo) return res.status(404).json({ msg: "Event not found" });

      // Image delete from folder
      if (expo.image) {
        const imagePath = path.join(__dirname, "..", "uploads", expo.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Expo.findByIdAndDelete(id);
      res.status(200).json({ msg: "Event Deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = ExpoController;
