// middleware to check if the user is logged in and has a valid token

const jwt = require("jsonwebtoken");

const SECRET = "your_jwt_secret";

const verifyUser = (req, res, next) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).send("Access denied. Token is required");
	}

	try {
		const decoded = jwt.verify(token, SECRET);
		req.username = decoded;
		next();
	} catch (error) {
		return res.status(400).send("Invalid token");
	}
};
