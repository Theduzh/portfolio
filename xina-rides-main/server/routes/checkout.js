const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
const {
    User,
    User_Rewards,
    Rewards,
    WalletTransactions,
    sequelize,
} = require("../models");
const { validateToken } = require("../middleware/auth");

router.get("/config", (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post("/payByWallet", validateToken, async (req, res) => {
    const { orderTotal, rentalId, accessToken } = req.body;
    const bike = JSON.parse(req.body.bike);
    const customerId = req.user.id;

    const user = await User.findByPk(customerId);
    if (!user) {
        res.status(400).json({ message: "Invalid customer" });
        return;
    }
    if (parseFloat(user.wallet) < orderTotal) {
        res.status(400).json({
            message: "Insufficient funds in wallet to pay for ride",
        });
        return;
    }
    const result = await User.update(
        {
            wallet: sequelize.literal(`wallet - ${orderTotal}`),
        },
        { where: { id: customerId } }
    );
    if (!(result == 1)) {
        res.status(500).json({
            message: "Server could not update customer wallet",
        });
        return;
    }
    try {
        await axios.put(
            `http://localhost:3001/bike/${bike.bikeId}`,
            {
                ...bike,
                name: bike.name,
                rentalPrice: parseFloat(bike.rentalPrice),
                bikeLat: Number(bike.bikeLat),
                bikeLon: Number(bike.bikeLon),
                currentlyInUse: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (err) {
        res.status(500).json({
            message: "Server could not update bike status",
        });
        return;
    }
    try {
        await axios.put(
            `http://localhost:3001/order/${rentalId}/end`,
            {
                orderPaymentStatus: "PAID",
                orderPaymentMethod: "Wallet",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (err) {
        res.status(500).json({
            message: "Server could not update order status",
        });
        return;
    }
    const order = await axios
        .get(`http://localhost:3001/order/${rentalId}`)
        .then((res) => res.data);

    const newTransaction = await WalletTransactions.create({
        orderId: order.orderId,
        description: "Rental Payment",
        amount: order.orderTotal,
        paymentMethod: "Wallet",
        userId: order.userId,
    });
    try {
        await axios.post(`http://localhost:3001/notification`, {
            type: "INFO",
            message: `You earned ${parseInt(
                order.orderTotal
            )} xcredits from this trip.`,
            status: "UNREAD",
            userId: order.userId,
        });
    } catch (err) {
        res.status(500).json({ message: "Server could not notify customer" });
    }
});

router.post("/createPaymentLink", validateToken, async (req, res) => {
    const {
        bike,
        orderTotal,
        rewards,
        rentalDuration,
        accessToken,
        cancelURL,
        successURL,
        rentalId,
        coords,
        customerEmail,
    } = req.body;
    const userId = req.user.id;
    let list = await Rewards.findAll({
        include: [
            {
                model: User,
                where: { id: userId },
                through: {
                    model: User_Rewards,
                    attributes: ["Used"],
                    where: { Used: 0 },
                },
            },
        ],
    });
    console.log(rewards)
    let options = [];
    for (let i = 0; i < list.length; i++) {
        options.push({
            label: list[i].header,
            value: list[i].id,
        });
    }
    try {
        const paymentLink = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "SGD",
                        product_data: {
                            name: `Bike Rental - ${bike.name}`,
                            description: `Rental Duration: ${Math.ceil(
                                rentalDuration / 3600
                            )} hours`,
                        },
                        unit_amount: orderTotal * 100, // Stripe requires amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            allow_promotion_codes: true,
            success_url: successURL,
            cancel_url: cancelURL,
            customer_email: customerEmail,
            metadata: {
                bike: JSON.stringify(bike),
                rentalId: rentalId,
                accessToken: accessToken,
                coords: JSON.stringify(coords),
                rewards: JSON.stringify(rewards),
            },
        });
        console.log(paymentLink);
        res.send({
            paymentLink: paymentLink.url,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.post("/", async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "SGD",
            amount: amount,
            payment_method_types: ["card"],
        });

        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.post("/createPromotionCode", async (req, res) => {
    const {
        promotion_name,
        promotion_code,
        discount_amount,
        stripe_account_id,
    } = req.body;
    try {
        // Create a Stripe Coupon
        const coupon = await stripe.coupons.create({
            name: `${discount_amount} off for ${promotion_name}`,
            percent_off: discount_amount,
            currency: "sgd",
            duration: "once",
            // Other coupon properties...
        });

        // Create a Stripe Promotion Code
        const promotionCode = await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: promotion_code,
            max_redemptions: 1,
            customer: stripe_account_id,
            // Other promotion code properties...
        });

        res.send({
            stripe_coupon_id: coupon.id,
            stripe_promotion_id: promotionCode.id,
            stripe_promotion_code: promotionCode.code,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.get("/getPromotionCodes", async (req, res) => {
    try {
        const promotionCodes = await stripe.promotionCodes.list({
            limit: 100, // Adjust the limit as needed
        });

        const promotionCodeList = promotionCodes.data.map((promotionCode) => {
            return {
                id: promotionCode.id,
                code: promotionCode.code,
                active: promotionCode.active,
                coupon_id: promotionCode.coupon.id,
                discount_amount: promotionCode.coupon.percent_off,
            };
        });

        res.send(promotionCodeList);
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.put("/updatePromotionCode", async (req, res) => {
    const {
        promotion_id,
        promotion_name,
        promotion_code,
        discount_amount,
        total_uses,
    } = req.body;

    try {
        // Retrieve the promotion code based on the promotion_code
        const existingPromotionCode = await stripe.promotionCodes.retrieve(
            promotion_id
        );

        if (!existingPromotionCode) {
            return res.status(404).send({
                error: {
                    message: "Promotion Code not found.",
                },
            });
        }

        const couponId = existingPromotionCode.coupon.id;
        const promotionId = existingPromotionCode.id;

        // Invalidating the old Promotion Code
        await stripe.promotionCodes.update(promotionId, {
            active: false,
        });
        await stripe.coupons.del(couponId);

        // Create a new Stripe Coupon
        const newCoupon = await stripe.coupons.create({
            name: `${discount_amount} off for ${promotion_name}`,
            percent_off: discount_amount,
            currency: "sgd",
            duration: "once",
            // Other coupon properties...
        });

        // Create a new Stripe Promotion Code
        const newPromotionCode = await stripe.promotionCodes.create({
            coupon: newCoupon.id,
            code: `${promotion_code}`, // Use a new code for the updated promotion code
            max_redemptions: total_uses,
            // Other promotion code properties...
        });

        res.send({
            new_stripe_coupon_id: newCoupon.id,
            new_stripe_promotion_id: newPromotionCode.id,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

router.delete(
    "/deletePromotionCode/:coupon_id/:promotion_id",
    async (req, res) => {
        const { promotion_id: promotionId, coupon_id: couponId } = req.params;
        try {
            await stripe.promotionCodes.update(promotionId, {
                active: false,
            });
            await stripe.coupons.del(couponId);
        } catch (e) {
            return res.status(400).send({
                error: {
                    message: e.message,
                },
            });
        }
    }
);

module.exports = router;
