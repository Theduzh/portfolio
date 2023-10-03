const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Order, Sequelize } = require("../models");
const { validateToken } = require("../middleware/auth");

router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    let validationSchema = yup.object().shape({
        orderStatus: yup.string().trim().min(3).max(100).required(),
        orderTotal: yup.number().required(),
        orderNotes: yup.string().trim().max(100),
        orderPaymentStatus: yup.string().trim().max(100).required(),
        orderPaymentMethod: yup.string().trim().max(100),
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

    data.rentalStartDate = new Date();
    data.orderStatus = data.orderStatus.trim().toUpperCase();
    data.orderCreationDate = new Date(); // Set the current date and time
    data.orderCompletionDate = null; // Set to null initially
    data.orderLastUpdate = new Date(); // Set the current date and time
    data.orderStatus = data.orderStatus.trim().toUpperCase();
    data.userId = req.user.id;

    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    const order = await Order.create(data);

    res.json(order);
});

router.get("/my-orders", validateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.findAll({
            where: {
                userId: userId,
            },
            order: [["createdAt", "ASC"]],
        });

        res.json(orders);
    } catch (error) {
        console.error("Error retrieving user orders:", error);
        res.status(500).json({ error: "Failed to retrieve user orders." });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;

    if (search) {
        if (search == "All") {
            search = "";
        }
        condition[Sequelize.Op.or] = [
            { orderId: { [Sequelize.Op.like]: `%${search}%` } },
            { orderStatus: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    const {
        orderStatus,
        rentalStartDate,
        rentalEndDate,
        orderTotalMin,
        orderTotalMax,
    } = req.query;

    if (orderStatus) {
        condition.orderStatus = orderStatus;
    }

    if (rentalStartDate) {
        condition.rentalStartDate = { [Sequelize.Op.gte]: rentalStartDate };
    }

    if (rentalEndDate) {
        condition.rentalEndDate = { [Sequelize.Op.lte]: rentalEndDate };
    }

    if (orderTotalMin && !isNaN(parseFloat(orderTotalMin))) {
        condition.orderTotal = {
            [Sequelize.Op.gte]: parseFloat(orderTotalMin),
        };
    }

    if (orderTotalMax && !isNaN(parseFloat(orderTotalMax))) {
        if (!condition.orderTotal) {
            condition.orderTotal = {};
        }
        condition.orderTotal[Sequelize.Op.lte] = parseFloat(orderTotalMax);
    }

    try {
        const list = await Order.findAll({
            where: condition,
            order: [["rentalEndDate", "ASC"]],
        });

        res.json(list);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).json({ error: "Failed to retrieve orders." });
    }
});

router.get("/rental-history", validateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.findAll({
            where: {
                userId: userId,
            },
            order: [["createdAt", "DESC"]],
        });

        res.json(orders);
    } catch (error) {
        console.error("Error retrieving user order history:", error);
        res.status(500).json({
            error: "Failed to retrieve user order history.",
        });
    }
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const order = await Order.findOne({
            where: { orderId: id },
        });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (error) {
        console.error("Error retrieving order:", error);
        res.status(500).json({ error: "Failed to retrieve order." });
    }
});

router.put("/:id/end", validateToken, async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    console.log(data.orderTotal > 0 ? "COMPLETED" : "CANCELLED");

    data.rentalStartDate = data.rentalStartDate;
    data.rentalEndDate = new Date();
    data.orderPaymentMethod =
        data.orderTotal > 0 ? data.orderPaymentMethod : "N/A";
    data.orderStatus = data.orderTotal > 0 ? "COMPLETED" : "CANCELLED";
    data.orderLastUpdate = new Date(); // Set the current date and time

    try {
        const order = await Order.findOne({
            where: { orderId: id, userId: userId },
        });
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }

        await Order.update(data, { where: { orderId: id, userId: userId } });

        const updatedOrder = await Order.findOne({
            where: { orderId: id, userId: userId },
        });

        // Return the updated order as the response
        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Failed to update order." });
    }
});

router.put("/:id", async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const validationSchema = yup.object().shape({
        orderStatus: yup.string().trim().min(3).max(100).required(),
        orderTotal: yup.number().required(),
        orderNotes: yup.string().trim().max(100),
        orderPaymentStatus: yup.string().trim().max(100).required(),
        orderPaymentMethod: yup.string().trim().max(100),
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

    data.orderStatus = data.orderStatus.trim();
    data.orderNotes = data.orderNotes.trim();
    data.orderPaymentStatus = data.orderPaymentStatus.trim();
    data.orderPaymentMethod = data.orderPaymentMethod.trim();
    data.updatedAt = new Date(); // Set the current date and time

    try {
        const order = await Order.findOne({ where: { orderId: id } });
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }

        await Order.update(data, { where: { orderId: id } });
        res.json({ message: "Order updated." });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Failed to update order." });
    }
});

router.delete("/:orderId", async (req, res) => {
    let { orderId } = req.params;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        let numDestroyed = await Order.destroy({ where: { orderId: orderId } });

        if (numDestroyed == 1) {
            return res.json({
                message: "Order was deleted successfully.",
            });
        } else {
            return res.status(400).json({
                message: `Cannot delete order with order id ${id}.`,
            });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ error: "Failed to delete order." });
    }
});

module.exports = router;
