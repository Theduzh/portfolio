const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const axios = require("axios");


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
        rejectUnauthorized: false
    }
});

router.post("/", async (req, res) => {
    const { email, promotion_name, promotion_code } = req.body;
    const html = `
        <h1>Your Promotion Code for ${promotion_name}</h1>
        <p>Promotion Code: ${promotion_code}</p>
    `;
    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `!!! XINA RIDES PROMOTION !!! ${promotion_name}`,
        html: html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ error: "Failed to send email." });
    }
});


router.post("/sendCustomPromotionCode", async (req, res) => {
    let data = req.body;
    console.log(data)
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const generatedPromoCode = data.promotion_code + randomNumber;

    try {
        const user_promotion = await axios.get(
            `http://localhost:3001/user_promotion?PromotionId=${data.PromotionId}&UserId=${data.UserId}`
        );

        console.log(generatedPromoCode)

        if (user_promotion.data.length != 0){
            throw "User Promotion exist" 
        }

        const stripe_data = await axios.post(
            `http://localhost:3001/checkout/createPromotionCode`,
            {
                promotion_name: data.promotion_name,
                promotion_code: generatedPromoCode,
                discount_amount: data.discount_amount
            }
        );

        await axios.post(
            `http://localhost:3001/email_promotion`,
            {
                email: data.email,
                promotion_name: data.promotion_name,
                promotion_code: stripe_data.data.stripe_promotion_code
            }
        )

    } catch (e)
    {
    }
    


})



module.exports = router;
