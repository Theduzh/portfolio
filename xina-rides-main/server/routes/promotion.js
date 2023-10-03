const express = require("express");
const router = express.Router();
const { Promotion, Sequelize } = require("../models");
const yup = require("yup");
const moment = require("moment");
const { parseISO } = require("date-fns");

router.post("/", async (req, res) => {
    let data = req.body;
    const now = new Date();
    data.start_date = new Date(data.start_date);
    data.end_date = new Date(data.end_date);
    console.log(req.body);
    console.log(now);

    // Validate request body
    let validationSchema = yup.object().shape({
        promotion_name: yup.string().trim().min(3).max(100).required(),
        promotion_description: yup.string().trim().min(3).max(500).required(),
        promotion_code: yup.string().trim().min(3).max(100).required(),
        start_date: yup
            .date()
            .default(() => new Date())
            .nullable(),
        end_date: yup
            .date()
            .default(() => new Date())
            .nullable(),
        start_time: yup
            .string()
            .matches(
                /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                "Invalid time format (HH:mm)"
            )
            .required("Start time is required"),
        end_time: yup
            .string()
            .matches(
                /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                "Invalid time format (HH:mm)"
            )
            .required("End time is required"),
        discount_amount: yup.number().min(0).max(100).required(),
        total_uses: yup.number().min(1).max(1000).required(),
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

    data.promotion_name = data.promotion_name.trim();
    data.promotion_code = data.promotion_code.toUpperCase().trim();
    data.promotion_description = data.promotion_description.trim();
    data.is_deleted = false;
    let result = await Promotion.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { promotion_name: { [Sequelize.Op.like]: `%${search}%` } },
            { promotion_description: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    if (req.query.is_deleted === "false") {
        condition.is_deleted = false;
    }

    let list = await Promotion.findAll({
        where: condition,
        order: [["createdAt", "DESC"]],
    });
    res.json(list);
});

router.get("/active_code/:promotion_code", async (req, res) => {
    const promotion_code = req.params.promotion_code
    const { search } = req.query;
    const now = moment();

    try {
        let whereCondition = {
            is_deleted: false,
        };

        if (search) {
            whereCondition.promotion_code = search;
        }

        const list = await Promotion.findAll({
            where: whereCondition,
            order: [["createdAt", "DESC"]],
        });

        const activePromotions = list.filter((promotion) => {
            const startDate = moment(promotion.start_date).format("YYYY-MM-DD");
            const endDate = moment(promotion.end_date).format("YYYY-MM-DD");
            const startTime = moment(promotion.start_time, "HH:mm");
            const endTime = moment(promotion.end_time, "HH:mm");

            const promotionStartDateTime = moment(
                `${startDate}T${startTime.format("HH:mm")}`,
                "YYYY-MM-DDTHH:mm"
            );
            const promotionEndDateTime = moment(
                `${endDate}T${endTime.format("HH:mm")}`,
                "YYYY-MM-DDTHH:mm"
            );

            return now.isBetween(
                promotionStartDateTime,
                promotionEndDateTime,
                null,
                "[]"
            ) && promotion.promotion_code == promotion_code;
        });

        if (activePromotions.length > 0) {
            res.json(true);
        } else {
            res.json(false);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching active promotions.",
        });
    }
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let promotion = await Promotion.findByPk(id);
    // Check id not found
    if (!promotion) {
        res.sendStatus(404);
        return;
    }
    res.json(promotion);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let promotion = await Promotion.findByPk(id);
    if (!promotion) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    const now = new Date();
    data.start_date = new Date(data.start_date);
    data.end_date = new Date(data.end_date);
    console.log(req.body);
    console.log(now);
    // Validate request body

    let validationSchema = yup.object().shape({
        promotion_name: yup.string().trim().min(3).max(100).required(),
        promotion_description: yup.string().trim().min(3).max(500).required(),
        promotion_code: yup.string().trim().min(3).max(100).required(),
        start_date: yup
            .date()
            .default(() => new Date())
            .nullable(),
        end_date: yup
            .date()
            .default(() => new Date())
            .nullable(),
        start_time: yup
            .string()
            .matches(
                /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                "Invalid time format (HH:mm)"
            )
            .required("Start time is required"),
        end_time: yup
            .string()
            .matches(
                /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                "Invalid time format (HH:mm)"
            )
            .required("End time is required"),
        discount_amount: yup.number().min(0).max(100).required(),
        total_uses: yup.number().min(1).max(1000).required(),
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

    data.promotion_name = data.promotion_name.trim();
    data.promotion_description = data.promotion_description.trim();
    data.promotion_code = data.promotion_code.toUpperCase().trim();
    let num = await Promotion.update(data, {
        where: { id: id },
    });
    if (num == 1) {
        res.json({
            message: "Promotion was updated successfully.",
        });
    } else {
        res.status(400).json({
            message: `Cannot update promotion with id ${id}.`,
        });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let promotion = await Promotion.findByPk(id);
    if (!promotion) {
        res.sendStatus(404);
        return;
    }

    let num = await Promotion.destroy({
        where: { id: id },
    });
    if (num == 1) {
        res.json({
            message: "Tutorial was deleted successfully.",
        });
    } else {
        res.status(400).json({
            message: `Cannot delete tutorial with id ${id}.`,
        });
    }
});

module.exports = router;
