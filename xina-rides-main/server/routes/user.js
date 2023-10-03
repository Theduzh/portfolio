const express = require("express");
const router = express.Router();
const yup = require("yup");
const {
    User,
    AccountType,
    WalletTransactions,
    Sequelize,
    sequelize,
} = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

require("dotenv").config();

const brevSMTP = {
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

const transporter = nodemailer.createTransport(brevSMTP);

function sendMailWithPromise(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

router.post("/transferToWallet", validateToken, async (req, res) => {
    const { transfer_amount } = req.body;
    try {
        const paymentLink = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "SGD",
                        product_data: {
                            name: "Transfer to XinaRides Wallet",
                            description: `Outstanding payable: $${transfer_amount}`,
                        },
                        unit_amount: transfer_amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/wallet",
            cancel_url: "http://localhost:3000/wallet",
            payment_intent_data: {
                metadata: {
                    userId: req.user.id,
                },
            },
        });
        res.send({
            paymentLink: paymentLink.url,
        });
    } catch (e) {
        res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.post("/convertToWallet", validateToken, async (req, res) => {
    const userId = req.user.id;
    const data = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        res.status(400).json({ message: "Cannot convert amount to user" });
        return;
    }
    const convertAmount = data.convert_amount;

    if (convertAmount > user.xcredit) {
        res.status(400).json({ message: "Insufficient XCredits" });
        return;
    }

    const result = await User.update(
        {
            wallet: sequelize.literal(
                `wallet + ${(convertAmount * (1 / 100)).toFixed(2)}`
            ),
            xcredit: sequelize.literal(`xcredit - ${convertAmount}`),
        },
        { where: { id: userId } }
    );

    const newTransaction = await WalletTransactions.create({
        description: `Wallet conversion of ${(
            convertAmount *
            (1 / 100)
        ).toFixed(2)}`,
        amount: (convertAmount * (1 / 100)).toFixed(2),
        paymentMethod: "XCredit Transfer",
        userId: userId,
    });

    if (result == 1) {
        res.status(200).json({
            message: `Successfully converted ${convertAmount}`,
        });
    } else {
        res.status(500).json({
            message: "Server could not convert specified amount",
        });
    }
});

router.post("/validatePassword", validateToken, async (req, res) => {
    const userId = req.user.id;
    const password = req.body.password;

    const user = await User.findByPk(userId);
    if (!user) {
        res.status(400).json({ message: "Cannot retrieve user data" });
        return;
    }
    let match = await bcrypt.compare(password, user.password);
    if (match) {
        res.status(200).json({ result: true });
    } else {
        res.status(400).json({ message: "Incorrect password" });
    }
});

router.post("/signup", async (req, res) => {
    const data = req.body;

    let validationSchema = yup.object().shape({
        firstName: yup
            .string()
            .trim()
            .min(2)
            .max(50)
            .matches(/^[a-z ,.'-]+$/i)
            .required(),
        lastName: yup
            .string()
            .trim()
            .min(2)
            .max(50)
            .matches(/^[a-z ,.'-]+$/i)
            .required(),
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.firstName = data.firstName.trim();
    data.lastName = data.lastName.trim();
    data.email = data.email.trim();
    data.password = data.password.trim();

    if (data.email === "xinarides@gmail.com" || data.isAdmin) {
        data.accountType = 2;
    } else {
        data.accountType = 1;
    }

    let user = await User.findOne({
        where: { email: data.email },
    });

    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    data.password = await bcrypt.hash(data.password, 10);
    let result = await User.create(data);
    res.json(result);
});

router.post("/signin", async (req, res) => {
    const data = req.body;

    const validationSchema = yup.object().shape({
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.email = data.email.trim();
    data.password = data.password.trim();

    let errorMsg = "Email or password is incorrect.";
    let user = await User.findOne({
        where: { email: data.email },
    });
    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    let verificationCode = null;
    if (user.twoFAEnabled == 1) {
        verificationCode = nanoid(6);
        console.log(verificationCode);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "XinaRIDES Verification Code",
            text: `Enter the following code into sign-in pop-up: ${verificationCode}.`,
        };

        try {
            await sendMailWithPromise(mailOptions);
        } catch (error) {
            res.status(500).json({
                message: "Could not send verification code",
            });
            return;
        }
    }

    let userInfo = {
        id: user.id,
    };

    let accessToken = sign(userInfo, process.env.APP_SECRET);

    res.json({
        accessToken: accessToken,
        verificationCode: verificationCode ? verificationCode : null,
    });
});

router.get("/walletTransactions", validateToken, async (req, res) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (user) {
        const walletTransactions = await user.getWalletTransactions({
            attributes: [
                "orderID",
                "createdAt",
                "description",
                "amount",
                "paymentMethod",
            ],
        }); // Sequelize creates this association method (at least it should)
        res.json(walletTransactions);
    } else {
        res.status(500).json({
            message: "Server could not retrieve wallet transactions",
        });
    }
});

router.get("/accounts", validateToken, async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { firstName: { [Sequelize.Op.like]: `%${search}%` } },
            { lastName: { [Sequelize.Op.like]: `%${search}%` } },
            { email: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    let accountsList = await User.findAll({
        where: condition,
        order: [["id", "ASC"]],
    });

    res.json(accountsList);
});

router.get("/getUser/:userId", async (req, res) => {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404).json({ message: "User cannot be retrieved " });
        return;
    }

    res.json(user);
});

router.get("/profile", validateToken, async (req, res) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
        include: [AccountType, WalletTransactions],
    });

    if (!user) {
        res.status(404).json({ message: "User cannot be retrieved " });
        return;
    }

    res.json(user);
});

router.put("/editprofile", validateToken, async (req, res) => {
    const userId = req.user.id;
    const data = req.body;
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
        res.status(400).json({ message: "Unable to retrieve user" });
        return;
    }

    let validationSchema = yup.object().shape({
        firstName: yup
            .string()
            .trim()
            .min(2)
            .max(50)
            .matches(/^[a-z ,.'-]+$/i)
            .required(),
        lastName: yup
            .string()
            .trim()
            .min(2)
            .max(50)
            .matches(/^[a-z ,.'-]+$/i)
            .required(),
        email: yup.string().trim().email().max(50).required(),
        gender: yup.string().trim().nullable(true),
        dateOfBirth: yup.string().nullable(true),
        country: yup.string().trim().nullable(true),
        phoneNo: yup.string().trim().nullable(true),
        aboutMe: yup.string().trim().max(100).nullable(true),
        profilePic: yup.string().trim().nullable(true),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });

        return;
    }

    const user = await User.findOne({
        where: {
            email: data.email,
        },
    });
    if (user && currentUser.email !== data.email) {
        res.status(400).json({ message: "Email already exists" });
        return;
    }

    data.firstName = data.firstName.trim();
    data.lastName = data.lastName.trim();
    data.email = data.email.trim();
    data.xcredit = data.xcredit;
    data.xcreditEarned = data.xcreditEarned;
    if (data.gender) {
        data.gender = data.gender.trim();
    }
    if (data.dateOfBirth) {
        data.dateOfBirth = data.dateOfBirth.trim();
    }
    if (data.country) {
        data.country = data.country.trim();
    }
    if (data.phoneNo) {
        data.phoneNo = data.phoneNo.trim();
    }
    if (data.aboutMe) {
        data.aboutMe = data.aboutMe.trim();
    }
    if (data.profilePic) {
        data.profilePic = data.profilePic.trim();
    }

    const result = await User.update(data, {
        where: {
            id: userId,
        },
    });

    if (result == 1) {
        res.json({ message: "Profile updated successfully." });
    } else {
        res.status(400).json({ message: "Cannot update profile." });
    }
});

router.put("/updateXCredit", validateToken, async (req, res) => {
    const userId = req.user.id;
    const data = req.body;
    let user = await User.findByPk(userId);
    if (!user) {
        res.status(400).json({ message: "User can't be found" });
        return;
    }
    console.log(data)
    let result = await User.update(
        { 
            xcredit: data.xcredit, 
            xcreditEarned: data.xcreditEarned 
        },
        {
            where: {
                id: userId,
            },
        }
    );
    console.log(result)
    if (result == 1) {
        res.json({ message: "XCredit updated successfully." });
    } else {
        res.status(400).json({ message: "Cannot update XCredit." });
    }
});

router.put("/toggle2fa", validateToken, async (req, res) => {
    const userId = req.user.id;

    let user = await User.findByPk(userId);
    if (!user) {
        res.status(400).json({ message: "User can't be found" });
        return;
    }

    let result = await User.update(
        { twoFAEnabled: !user.twoFAEnabled },
        {
            where: {
                id: userId,
            },
        }
    );

    if (result == 1) {
        res.json({ message: "2FA enabled." });
    } else {
        res.status(400).json({ message: "2FA can't be toggled" });
    }
});

router.put("/changepassword", validateToken, async (req, res) => {
    const data = req.body;
    const userId = req.user.id;

    let validationSchema = yup.object().shape({
        oldPassword: yup.string().trim().min(8).max(50).required(),
        newPassword: yup.string().trim().min(8).max(50).required(),
    });
    try {
        await validationSchema.validate(data, {
            abortEarly: true,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.oldPassword = data.oldPassword.trim();
    data.newPassword = data.newPassword.trim();

    let user = await User.findByPk(userId);
    let match = await bcrypt.compare(data.oldPassword, user.password);
    if (!match) {
        res.status(400).json({
            message: "Old password does not match current password",
        });
        return;
    }

    data.newPassword = await bcrypt.hash(data.newPassword, 10);

    let result = await User.update(
        { password: data.newPassword },
        {
            where: { id: userId },
        }
    );

    if (result == 1) {
        res.json({ message: "Password changed" });
    } else {
        res.json({ message: "Update failed" });
    }
});

router.delete("/", validateToken, async (req, res) => {
    const userId = req.user.id;

    const result = await User.destroy({
        where: {
            id: userId,
        },
    });

    if (result == 1) {
        res.json({ message: "Successfully deleted account." });
    } else {
        res.json({ message: "Failed to delete account." });
    }
});

module.exports = router;
