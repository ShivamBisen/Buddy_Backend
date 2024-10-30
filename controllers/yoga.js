const prisma = require("../db");

const saveLikedYoga = async (req, res) => {
	const { userId, feedId } = req.body; // Changed likedYogaId to feedId to match your schema

	try {
		const likedYoga = await prisma.LikedFeed.create({
			data: {
				userId: userId,
				feedId: feedId, // Use feedId as per your Prisma schema
			},
		});

		res.status(201).json({
			message: "Yoga pose liked successfully",
			likedYoga, // Return the created liked yoga data
		});
	} catch (err) {
		res.status(500).json({
			error: "Failed to like yoga pose",
			details: err.message,
		});
	}
};
const getLikedYoga = async (req, res) => {
	const userId = req.query.userId;
	try {
		const likedYoga = await prisma.likedFeed.findMany({
			where: {
				userId: Number(userId),
			},
			select: {
				feedId: true,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to get liked yoga pose",
			details: err.message,
		});
	}
};

module.exports = {
	saveLikedYoga,
	getLikedYoga,
};
