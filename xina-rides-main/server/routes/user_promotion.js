const express = require("express");
const router = express.Router();
const { User_Promotion, Sequelize } = require("../models");
const yup = require("yup");
const moment = require("moment");

router.post("/", async (req, res) => {
    let data = req.body;
    console.log(req.body);

    // Validate request body
    let validationSchema = yup.object().shape({
        user_uses: yup.number().min(1).max(1000).required(),
        promotion_code: yup.string().trim().min(3).max(100).required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.promotion_code = data.promotion_code.trim();
    let result = await User_Promotion.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { PromotionId: { [Sequelize.Op.like]: `%${search}%` } },
            { UserId: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    let list = await User_Promotion.findAll({
        where: {
            ...condition,
            PromotionId: req.query.PromotionId,
            UserId: req.query.UserId,
        },
        order: [["createdAt", "DESC"]],
    });
    res.json(list);
});

router.put("/", async (req, res) => {
    let data = req.body;
    let userId = data.UserId;
    let promotionId = data.PromotionId; 

    let promotion = await User_Promotion.findOne({
        where: { UserId: userId, PromotionId: promotionId },
    });

    if (!promotion) {
        res.sendStatus(404);
        return;
    }

    let validationSchema = yup.object().shape({
        user_uses: yup.number().min(1).max(1000).required(),
        promotion_code: yup.string().trim().min(3).max(100).required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Update the user_uses and promotion_code columns
    try {
        await User_Promotion.update(
            {
                user_uses: data.user_uses,
                promotion_code: data.promotion_code.trim(),
            },
            {
                where: { UserId: userId, PromotionId: promotionId },
            }
        );

        res.json({
            message: "Promotion relationship was updated successfully.",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message:
                "An error occurred while updating the promotion relationship.",
        });
    }
});


module.exports = router;