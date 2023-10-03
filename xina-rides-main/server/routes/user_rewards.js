const express = require("express");
const router = express.Router();
const yup = require("yup");
const {
    User_Rewards,
    User,
    Rewards,
    Sequelize,
    sequelize,
} = require("../models");
const { validateToken } = require("../middleware/auth");

router.post("/LinkUserReward", validateToken, async (req, res) => {
    let reward = req.body;

    const rewards = await Rewards.findByPk(reward.RewardId);
    const user = await User.findByPk(reward.UserId);

    await user.addRewards(rewards, {
        through: { model: User_Rewards, Used: false },
    });
});

router.get("/", validateToken, async (req, res) => {
    let list = await User_Rewards.findAll();
    res.json(list);
});

router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let list = await Rewards.findAll({
        include: [
            {
                model: User,
                where: { id: id },
                through: { model: User_Rewards, attributes: ["Used"] },
            },
        ],
    });

    res.json(list);
});

router.get("/search/:id/", validateToken, async (req, res) => {
    let id = req.params.id;
    let condition = {};
    let search = req.query.search;

    condition[Sequelize.Op.and] = [
        { expiryDate: { [Sequelize.Op.gt]: new Date() } },
    ];

    if (search) {
        condition[Sequelize.Op.or] = [
            { header: { [Sequelize.Op.like]: `%${search}%` } },
            { category: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    let list = await Rewards.findAll({
        where: condition,
        include: [
            {
                model: User,
                where: { id: id },
                through: {
                    model: User_Rewards,
                    attributes: ["Used"],
                },
            },
        ],
    });

    res.json(list);
});

router.get("/fulldetails", validateToken, async (req, res) => {
    let list = await User_Rewards.findAll({
        attributes: [
            "UserId",
            // 'firstName',
            // 'lastName',
            [
                sequelize.literal(
                    'CONCAT("User"."firstName", " ", "User"."lastName")'
                ),
                "Name",
            ],
            "RewardId",
            "title",
            "xcredit",
            "createdAt",
        ],
        include: [
            {
                model: User,
            },
            {
                model: Rewards,
            },
        ],
    });

    res.json(list);
});

router.put("/:userid/:rewardid", validateToken, async (req, res) => {
    const userid = req.params.userid;
    const rewardid = req.params.rewardid;
    console.log('testing')
    try {
        await User_Rewards.update(
            {
                Used: true,
            },
            {
                where: { UserId: userid, RewardId: rewardid },
            }
        );

        res.json({
            message: "Rewards relationship was updated successfully.",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message:
                "An error occurred while updating the rewards relationship.",
        });
    }
});

module.exports = router;
