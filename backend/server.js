const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Connection/db"); 

const hallRoutes = require('./Routes/hallRoutes');
const expoRoutes = require("./Routes/expoRoutes");
const boothRoutes = require("./Routes/boothRoutes");
const adminRoutes = require('./Routes/adminRoutes');
const userroutes = require('./Routes/userroutes');
const { createDefaultAdmin } = require('./Controllers/adminController'); // âœ… added

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use("/api/expos", expoRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/booths', boothRoutes);
app.use("/api/user/", userroutes);
// ðŸ” Create default admin
//createDefaultAdmin(); // âœ… call here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


