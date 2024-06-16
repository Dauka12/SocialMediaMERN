const { prisma } = require("../prisma/prisma-client");
const { connect } = require("../routes");

const FollowController = {
    followUser: async (req, res) => {
        const { followingId } = req.body;
        const userId = req.user.userId;
        if (followingId === userId) {
            return res.status(500).json({error:"Нельзя подписаться на самого себя"})
        }
        try {
            const existingFollower = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })
            if (existingFollower) {
                return res.status(400).json({error:"Вы уже подписаны!"})
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId } },
                    following: { connect: { id: followingId } },
                }
            })
            res.status(201).json({message:"Вы подписались!"})
        } catch (error) {
            console.error('Error in Follow User ', error)
            res.status(500).json({ error : 'Internal server error!' })
        }
    },
    unfollowUser: async (req, res) => {
        const { followingId } = req.params;
        const userId = req.user.userId;

        try {
            const existingFollow = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })
            if (!existingFollow) {
                return res.status(404).json({error:"Подписка не найдена!"})
            }
            await prisma.follows.deleteMany({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            })
            res.status(201).json({message:"Вы успешно отписались!"})
        } catch (error) {
            console.error('Error in unfollow', error)
            res.status(500).json({ error : 'Internal server error!' })
        }
    }
}

module.exports = FollowController;