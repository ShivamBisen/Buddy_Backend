const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Save likedYogaId for a user
const saveLikedYogaForUser = async (userId, likedYogaId) => {
    return prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
            likedYogaIds: {
                push: likedYogaId
            }
        }
    });
};

module.exports = {
    saveLikedYogaForUser
};
