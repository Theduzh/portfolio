const express = require("express");
const router = express.Router();
const axios = require("axios");
const endpointSecret = "whsec_t7rTwhcOyr68wnIuZ5RnZQcX7i7T3Sjl";
const intentHookSecret = "whsec_4bEaLClLzv2cL6HyY3O6ZLV9G4IAle2r";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { User, WalletTransactions } = require("../models");
const db = require("../models");

router.post(
    "/",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        try {
            // Verify the event's signature
            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret
            );

            // Handle the event based on its type
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                console.log(session, "test");
                if (session.metadata) {
                    const bike = JSON.parse(session.metadata.bike);
                    const rentalId = session.metadata.rentalId;
                    const accessToken = session.metadata.accessToken;
                    const paymentIntentId = session.payment_intent;
                    const coords = JSON.parse(session.metadata.coords);
                    const rewards = JSON.parse(session.metadata.rewards);

                    // Retrieve the Payment Intent using the Stripe API
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        paymentIntentId
                    );

                    // Retrieve the payment method details from the Payment Intent
                    const paymentMethodId = paymentIntent.payment_method;
                    const paymentMethod = await stripe.paymentMethods.retrieve(
                        paymentMethodId
                    );

                    try {
                        await axios.put(
                            `http://localhost:3001/bike/${bike.bikeId}`,
                            {
                                ...bike,
                                name: bike.name,
                                rentalPrice: parseFloat(bike.rentalPrice),
                                bikeLat: Number(coords.latitude),
                                bikeLon: Number(coords.longitude),
                                currentlyInUse: false,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        await axios.put(
                            `http://localhost:3001/order/${rentalId}/end`,
                            {
                                orderTotal: parseFloat(
                                    (paymentIntent.amount / 100).toFixed(2)
                                ),
                                orderPaymentStatus: "PAID",
                                orderPaymentMethod: `${
                                    paymentMethod.card.brand
                                        .charAt(0)
                                        .toUpperCase() +
                                    paymentMethod.card.brand.slice(1)
                                } ${paymentMethod.card.last4}`,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    }

                    const order = await axios
                        .get(`http://localhost:3001/order/${rentalId}`)
                        .then((res) => res.data);

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
                        console.log(err);
                    }

                    let RedeemData = {};
                    try {
                        await axios
                            .get(
                                `http://localhost:3001/user/getUser/${order.userId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            )
                            .then((res) => {
                                res.data.xcredit += parseInt(order.orderTotal);
                                res.data.xcreditEarned += parseInt(
                                    order.orderTotal
                                );
                                RedeemData = {
                                    xcredit: res.data.xcredit,
                                    xcreditEarned: res.data.xcreditEarned,
                                    firstName: res.data.firstName,
                                    lastName: res.data.lastName,
                                    email: res.data.email,
                                };
                            });
                        
                        console.log(RedeemData)
                        await axios
                            .put(
                                `http://localhost:3001/userrewards/${order.userId}/${rewards.id}`,
                                RedeemData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            )
                            .then((res) => res.data);

                        await axios.put(
                            `http://localhost:3001/user/updateXCredit`,
                            RedeemData,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    }

                    try {
                        await axios
                            .put(
                                `http://localhost:3001/user/updateXCredit`,
                                RedeemData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            )
                            .then((res) => {
                                console.log(res.data);
                            });
                    } catch (err) {
                        err
                    }
                }
            }

            res.sendStatus(200);
        } catch (err) {
            console.error("Webhook error:", err.message);
            res.sendStatus(400);
        }
    }
);

router.post(
    "/intent-hook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        // console.log(`Request: ${req.body}, Sig: ${sig}, endPointSecret: ${endpointSecret}`)
        try {
            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                intentHookSecret
            );
            switch (event.type) {
                case "payment_intent.succeeded":
                    const session = event.data.object;
                    if (session.metadata.userId) {
                        const userId = session.metadata.userId;

                        const result = await User.update(
                            {
                                wallet: db.sequelize.literal(
                                    `wallet + ${(session.amount / 100).toFixed(
                                        2
                                    )}`
                                ),
                            },
                            { where: { id: userId } }
                        );

                        const paymentMethodObject =
                            await stripe.paymentMethods.retrieve(
                                session.payment_method
                            );
                        let cardBrand;
                        switch (paymentMethodObject.card.brand) {
                            case "visa":
                                cardBrand = `Visa ${paymentMethodObject.card.last4}`;
                                break;
                            case "mastercard":
                                cardBrand = `Mastercard ${paymentMethodObject.card.last4}`;
                                break;
                            case "american_express":
                                cardBrand = `American Express ${paymentMethodObject.card.last4}`;
                                break;
                            default:
                                cardBrand = "Unknown Card";
                        }

                        const newTransaction = WalletTransactions.create({
                            description: `Wallet transfer of $${(
                                session.amount / 100
                            ).toFixed(2)}`,
                            amount: (session.amount / 100).toFixed(2),
                            paymentMethod: cardBrand,
                            userId: userId,
                        });

                        if (result == 1) {
                            console.log("Transfer successful");
                        } else {
                            res.status(500).json({
                                message:
                                    "Server could not transfer specified amount",
                            });
                        }
                    } else {
                        res.status(500).json({
                            message:
                                "Server could not transfer specified amount",
                        });
                    }
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
                    res.status(500).json({
                        message: "Server could not transfer specified amount",
                    });
            }
        } catch (err) {
            console.error("Webhook error:", err.message);
            res.status(500).json({ message: `Webhook error: ${err.message}` });
        }
    }
);

module.exports = router;
