const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Connection/db");

const expoRoutes = require("./Routes/expoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expos", expoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
