const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Notification, Sequelize } = require("../models");
const { validateToken } = require("../middleware/auth");

router.post("/", async (req, res) => {
    let data = req.body;

    let validationSchema = yup.object().shape({
        type: yup.string().trim().min(3).max(100).required(),
        message: yup.string().trim().max(100).required(),
        status: yup.string().trim().max(100).required(),
        userId: yup.number().required(),
    });

    data.type = data.type.trim().toUpperCase();
    data.message = data.message.trim();
    data.status = data.status.trim().toUpperCase();

    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    const notification = await Notification.create(data);

    res.json(notification);
});

router.get("/", validateToken, async (req, res) => {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
        where: { userId: userId },
        order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
});
// mark all notifications for the user as read
router.put("/read", validateToken, async (req, res) => {
    const notifications = await Notification.findAll({
        where: { userId: req.user.id },
    });

    if (notifications) {
        notifications.forEach(async (notification) => {
            notification.status = "READ";

            await notification.save();
        });

        res.json(notifications);
    } else {
        res.status(404).json({ error: "Notifications not found" });
    }
});

router.get("/:id", async (req, res) => {
    const notification = await Notification.findByPk(req.params.id);

    if (notification) {
        res.json(notification);
    } else {
        res.status(404).json({ error: "Notification not found" });
    }
});

// mark as read notification
router.put("/:id/read", validateToken, async (req, res) => {
    const notification = await Notification.findByPk(req.params.id);

    if (notification) {
        notification.status = "READ";

        await notification.save();

        res.json(notification);
    } else {
        res.status(404).json({ error: "Notification not found" });
    }
});

module.exports = router;
