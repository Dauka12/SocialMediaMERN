const { prisma } = require("../prisma/prisma-client");

const LikeController = {
    likePost: async (req, res) => {
        const { postId } = req.body;
        const userId = req.user.userId;

        if (!postId) {
            return res.status(400).json({ error: "Все поля обьязательны" })
        }
        try {
            const existingLike = await prisma.like.findFirst({
                where: { postId, userId }
            })
            if (existingLike) {
                return res.status(400).json({error:"Вы уже поставили лайк!"})
            }
            const like = await prisma.like.create({
                data: {
                    postId,
                    userId
                }
            })
            res.json({like})
        } catch (error) {
            console.error('Error in Like ', error)
            res.status(500).json({ error : 'Internal server error!' })
        }
    },
    unlikePost: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;
        if (!id) {
            return res.status(400).json({error:'Вы уже убрали лайк!'})
        }
        try {
            const existingLike = await prisma.like.findFirst({
                where: { postId: id, userId }
            })
            if (!existingLike) {
                return res.status(400).json({error:"Вы уже убрали лайк!"})
            }
            if (existingLike.userId !== userId) {
                return res.status(403).json({error:"Нет доступа!"})
            }
            const like = await prisma.like.deleteMany({ where: { postId: id, userId } })
            res.json(like)
        } catch (error) {
            console.error('Error in Unlike ', error)
            res.status(500).json({ error : 'Internal server error!' })
        }
    }

}

module.exports = LikeController;