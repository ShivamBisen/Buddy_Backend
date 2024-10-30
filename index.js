const express = require("express");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/upload");
const yogaRoutes = require("./routes/yoga");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json()); // For parsing application/json

// Routes
app.use("/api", uploadRoutes);
app.use("/api", yogaRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
