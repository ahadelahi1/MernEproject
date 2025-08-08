const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./Connection/db"); 
connectDB(); 
const hallRoutes = require('./Routes/hallRoutes');
const expoRoutes = require("./Routes/expoRoutes");
const boothRoutes = require("./Routes/boothRoutes");
const adminRoutes = require('./Routes/adminRoutes');
const userroutes = require('./Routes/userroutes');
let {createDefaultAdmin} =  require("./Controllers/adminController");
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use("/api/expos", expoRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/booths', boothRoutes);
app.use("/api/user/", userroutes);

createDefaultAdmin(); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
