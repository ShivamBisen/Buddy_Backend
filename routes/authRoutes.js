const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();
const SECRET_KEY = "your_jwt_secret_key"; // Replace this with a secure key

// Registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userExist) {
        return res.status(400).send('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword // Save the hashed password
        }
    });

    return res.status(201).send({ message: "User registered successfully" });
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h' // Token expires in 1 hour
    });

    return res.status(200).send({ message: "Login successful", token });
});

module.exports = router;
 