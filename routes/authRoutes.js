const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();
const SECRET_KEY = "your_jwt_secret_key"; // Replace this with a secure key

// Registration route
router.post("/register", async (req, res) => {
	const { username, security_question, security_answer } = req.body;

	// Check if the user already exists
	const userExist = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (userExist) {
		return res.status(400).send("User already exists");
	}

	// Hash the password
	const hashedAnswer = await bcrypt.hash(security_answer, 10);

	// Create the user
	const user = await prisma.user.create({
		data: {
			username,
			security_question,
			security_answer: hashedAnswer,
		},
	});

	// Generate a JWT token
	const token = jwt.sign(
		{ id: user.id, username: user.username },
		SECRET_KEY,
		{
			expiresIn: "1d",
		}
	);

	return res
		.status(200)
		.send({ message: "User registered successfully", token });
});

router.post("/security-question", async (req, res) => {
	const { username } = req.body;

	// Check if the user exists
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) {
		return res.status(404).send("User not found");
	}

	return res.status(200).send({ security_question: user.security_question });
});

// Login route
router.post("/login", async (req, res) => {
	const { username, security_answer, rememberMe = false } = req.body;

	// Check if the user exists
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) {
		return res.status(404).send("User not found");
	}

	// Compare the provided password with the hashed password
	const isAnswerValid = await bcrypt.compare(
		security_answer,
		user.security_answer
	);

	if (!isAnswerValid) {
		return res.status(401).send("Wrong Answer");
	}

	// Generate a JWT token
	const token = jwt.sign(
		{ id: user.id, username: user.username },
		SECRET_KEY,
		{
			expiresIn: rememberMe ? "7d" : "1d",
		}
	);

	return res.status(200).send({ message: "Login successful", token });
});

module.exports = router;
