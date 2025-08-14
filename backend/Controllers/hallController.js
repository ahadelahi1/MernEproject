// const Hall = require('../Models/Hall');


// // Add Hall
// exports.addHall = async (req, res) => {
//   try {
//     const { hallNumber, numberOfBooths, expoId } = req.body;
//     console.log("📥 Incoming Add Hall Request Body:", req.body);

//     // 🛑 Duplicate hall check within the same expo
//     const existingHall = await Hall.findOne({ hallNumber, expoId });
//     if (existingHall) {
//       return res.status(400).json({ 
//         message: `Hall ${hallNumber} is already added in the selected Event` 
//       });
//     }

//     const newHall = new Hall({ hallNumber, numberOfBooths, expoId });
//     await newHall.save();
//     res.status(201).json(newHall);

//   } catch (error) {
//     console.log("❌ Add Hall Error:", error);
//     res.status(500).json({ message: 'Failed to add hall', error: error.message });
//   }
// };



// // Get All Halls
// // Get All Halls (with search & filter)
exports.getHalls = async (req, res) => {
  try {
    const { hallNumber, search } = req.query;
    let query = {};

    // Filter by hall number if provided
    if (hallNumber) {
      query.hallNumber = hallNumber;
    }

    // Find halls & populate expo title
    let halls = await Hall.find(query).populate('expoId', 'title');

    // Search by expo title if provided
    if (search) {
      halls = halls.filter(hall =>
        hall.expoId?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch halls', error });
  }
};


// // Get Single Hall
// exports.getHallById = async (req, res) => {
//   try {
//     const hall = await Hall.findById(req.params.id);
//     res.json(hall);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch hall', error });
//   }
// };


// // Update Hall
// exports.updateHall = async (req, res) => {
//   try {
//     const { hallNumber, numberOfBooths, expoId } = req.body;

//     // 🛑 Duplicate hall check in same expo, ignoring the current hall's own ID
//     const existingHall = await Hall.findOne({
//       hallNumber,
//       expoId,
//       _id: { $ne: req.params.id }
//     });

//     if (existingHall) {
//       return res.status(400).json({
//         message: `Hall ${hallNumber} is already added in the selected Event`
//       });
//     }

//     const updated = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
    
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update hall', error: error.message });
//   }
// };


// // Delete Hall
// exports.deleteHall = async (req, res) => {
//   try {
//     await Hall.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Hall deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete hall', error });
//   }
// };

const Hall = require('../Models/Hall');
const Booth = require('../Models/Booth'); // ✅ Make sure this is imported

// Add Hall
exports.addHall = async (req, res) => {
  try {
    const { hallNumber, numberOfBooths, expoId } = req.body;
    console.log("📥 Incoming Add Hall Request Body:", req.body);

    // 🛑 Duplicate hall check within the same expo
    const existingHall = await Hall.findOne({ hallNumber, expoId });
    if (existingHall) {
      return res.status(400).json({ 
        message: `Hall ${hallNumber} is already added in the selected Event` 
      });
    }

    // ✅ 1. Create the Hall
    const newHall = new Hall({ hallNumber, numberOfBooths, expoId });
    const savedHall = await newHall.save();

    // ✅ 2. Automatically create Booths
    const booths = [];

    for (let i = 1; i <= numberOfBooths; i++) {
      booths.push({
        stallNumber: `S${i}`,
        name: `Booth ${i}`,
        capacity: 1, // Default capacity (can change later)
        hall: savedHall._id,
        availability: "Available"
      });
    }

    await Booth.insertMany(booths); // Bulk insert

    // ✅ 3. Return success
    res.status(201).json({ message: "Hall and booths created successfully", hall: savedHall });

  } catch (error) {
    console.log("❌ Add Hall Error:", error);
    res.status(500).json({ message: 'Failed to add hall', error: error.message });
  }
};
exports.deleteHall = async (req, res) => {
  try {
    const hallId = req.params.id;

    // 1. Delete related booths first
    await Booth.deleteMany({ hall: hallId });

    // 2. Delete the hall
    await Hall.findByIdAndDelete(hallId);

    res.json({ message: 'Hall and related booths deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete hall', error });
  }
};
