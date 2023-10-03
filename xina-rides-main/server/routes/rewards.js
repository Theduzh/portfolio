const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Rewards, User, Sequelize, sequelize } = require("../models");
const { validateToken } = require("../middleware/auth");
const User_Rewards = require("../models/User_Rewards");
const nodemailer = require("nodemailer");


// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true, // include SMTP traffic in the logs
    tls: {
        rejectUnauthorized: false,
    },
});

router.post("/CreateRewards", validateToken, async (req, res) => {
    let data = req.body;

    let validationSchema = yup.object().shape({
        header: yup.string().trim().min(3).max(100).required(),
        category: yup.string().trim().min(3).max(100).required(),
        title: yup.string().trim().min(3).max(100).required(),
        titleSubhead: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(100).required(),
        discount: yup
            .number("Discount input must be a number!")
            .moreThan(1, "Discount must be at least 1%")
            .lessThan(100.01, "Discount must be at most 100%")
            .positive()
            .required(),
        xcredit: yup.number().moreThan(-1).positive().required(),
        expiryDate: yup
            .date()
            .min(new Date(), "Expiry Date must be in the future!")
            .required(),
    });

    try {
        await validationSchema.validate(data, {
            abortEarly: false,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    let result = await Rewards.create(data, { through: User_Rewards });
    res.json(result);
});

router.post("/notify", validateToken, async (req, res) => {
    let rewards = req.body;
    const users = await User.findAll({
        attributes: ["email"],
        where: { accountType: 1 },
    }).then((data) => {
        return data.map((entity) => entity.get("email")); // set email to list
    });
    if (!users) {
        res.status(500);
        return;
    }
    const message = {
        from: process.env.EMAIL_USER,
        bcc: users,
        subject: "Xina Rides Rewards",
        text: `${rewards.header}`,
        html: `
                <h1>${rewards.title}</h1>
                <p>${rewards.description}</p>
                <img src="${rewards.imageFile
                ? `../public/uploads/${rewards.imageFile}`
                : "../public/uploads/card.png"
            }" alt="rewards image">
            
        `,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error("Error sending email: ", err);
        res.status(500).json({ error: "Failed to send email." });
    }
});

router.get("/", validateToken, async (req, res) => {
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

        order: [["createdAt", "DESC"]],
    });

    res.json(list);
});

router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let rewards = await Rewards.findByPk(id);
    if (!rewards) {
        res.sendStatus(404);
        return;
    }

    res.json(rewards);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let rewards = await Rewards.findByPk(id);
    if (!rewards) {
        res.sendStatus(404);
        return;
    }

    const data = req.body;

    let validationSchema = yup.object().shape({
        header: yup.string().trim().min(3).max(100).required(),
        category: yup.string().trim().min(3).max(100).required(),
        title: yup.string().trim().min(3).max(100).required(),
        titleSubhead: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(100).required(),
        discount: yup
            .number("Discount input must be a number!")
            .moreThan(1, "Discount must be at least 1%")
            .lessThan(100.01, "Discount must be at most 100%")
            .positive()
            .required(),
        xcredit: yup.number().moreThan(0).positive().required(),
        expiryDate: yup
            .date()
            .min(new Date(), "Expiry Date must be in the future!")
            .required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.header = data.header.trim();
    data.category = data.category.trim();
    data.title = data.title.trim();
    data.description = data.description.trim();

    const result = await Rewards.update(data, {
        where: { id: id },
    });

    if (result == 1) {
        res.json({ message: "Rewards updated successfully." });
    } else {
        res.status(400).json({ message: "Cannot update rewards." });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let rewards = await Rewards.findByPk(id);
    if (!rewards) {
        res.sendStatus(404);
        return;
    }

    const result = await Rewards.destroy({
        where: {
            id: id,
        },
    });

    if (result == 1) {
        res.json({ message: "Successfully deleted rewards." });
    } else {
        res.json({ message: "Failed to delete rewards." });
    }
});

module.exports = router;
