const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const prisma = require("../db");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file"); // Expecting a single file in the 'file' field

const uploadFile = (req, res) => {
	// Multer will handle the file extraction
	upload(req, res, async (err) => {
		if (err) {
			return res
				.status(500)
				.json({ error: "Failed to upload file", details: err.message });
		}

		const file = req.file;

		if (!file) {
			return res.status(400).json({ error: "No file provided" });
		}

		try {
			// Upload the file buffer to Cloudinary
			const result = await cloudinary.uploader
				.upload_stream(
					{ resource_type: "auto", folder: "uploads" },
					async (error, result) => {
						if (error) {
							return res
								.status(500)
								.json({
									error: "Failed to upload to Cloudinary",
									details: error.message,
								});
						}

						const userId = req.query.userId;
						console.log(userId); // Ensure userId is extracted from params
						// Verify if the user exists
						const existingUser = await prisma.user.findUnique({
							where: {
								id: Number(userId),
							},
						});

						if (!existingUser) {
							return res
								.status(404)
								.json({ error: "User not found" });
						}

						// Create a new Image entry in the database and associate it with the User
						const newImage = await prisma.data.create({
							data: {
								url: result.secure_url, // Use the URL from Cloudinary
								user: {
									connect: { id: Number(userId) }, // Connect the existing user by ID
								},
							},
						});

						return res.status(200).json({
							message:
								"File uploaded and image created successfully",
							cloudinaryData: result.secure_url, // Return the Cloudinary URL
							newImage, // Return the created image entry
						});
					}
				)
				.end(file.buffer); // Upload the file buffer directly to Cloudinary
		} catch (err) {
			return res.status(500).json({
				error: "Failed to upload file",
				details: err.message,
			});
		}
	});
};

const getData = async (req, res) => {
	const userId = req.query.userId;

	try {
		const data = await prisma.data.findMany({
			where: {
				userId: Number(userId), // Use the userId from the request parameters
			},
			select: {
				// Use 'select' to specify which fields you want
				url: true, // Only return the 'url' field
			},
		});

		return res.status(200).json(data);
	} catch (err) {
		return res.status(500).json({
			error: "Failed to fetch data",
			details: err.message,
		});
	}
};

module.exports = {
	uploadFile,
	getData,
};
