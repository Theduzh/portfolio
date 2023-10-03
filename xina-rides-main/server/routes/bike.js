const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Bike, Sequelize } = require("../models");
const { validateToken } = require("../middleware/auth");

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) *
            Math.cos(degToRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}

// Helper function to convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

router.post("/add", validateToken, async (req, res) => {
    let data = req.body;

    let validationSchema = yup.object().shape({
        name: yup.string().trim().min(3).max(100).required(),
        currentlyInUse: yup.bool().required(),
        rentalPrice: yup
            .number()
            .moreThan(0)
            .lessThan(1000)
            .positive()
            .required(),
        condition: yup.string().max(10000),
        bikeLat: yup
            .number()
            .moreThan(-90)
            .lessThan(90)
            .optional()
            .nullable(true),
        bikeLon: yup
            .number()
            .moreThan(-180)
            .lessThan(180)
            .optional()
            .nullable(true),
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

    let result = await Bike.create(data);
    res.json(result);
});

router.put("/:bikeId/rent", validateToken, async (req, res) => {
    let bikeId = req.params.bikeId;

    let bikeExists = await Bike.findByPk(bikeId);
    if (!bikeExists) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;

    data.currentlyInUse = true;

    let numUpdated = await Bike.update(data, {
        where: { bikeId: bikeId },
    });
    if (numUpdated == 1) {
        res.json({
            message: "Bike was updated successfully.",
        });
    } else {
        res.status(400).json({
            message: `Bike with bikeId ${bikeId} could not be updated.`,
        });
    }
});

router.put("/:bikeId", validateToken, async (req, res) => {
    let bikeId = req.params.bikeId;

    let bikeExists = Bike.findByPk(bikeId);
    if (!bikeExists) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;

    let validationSchema = yup.object().shape({
        name: yup.string().trim().min(3).max(100).required(),
        currentlyInUse: yup.bool().required(),
        rentalPrice: yup
            .number()
            .moreThan(0)
            .lessThan(1000)
            .positive()
            .required(),
        condition: yup.string().max(10000),
        bikeLat: yup
            .number()
            .moreThan(-90)
            .lessThan(90)
            .optional()
            .nullable(true),
        bikeLon: yup
            .number()
            .moreThan(-180)
            .lessThan(180)
            .optional()
            .nullable(true),
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

    let numUpdated = await Bike.update(data, {
        where: { bikeId: bikeId },
    });
    if (numUpdated == 1) {
        res.json({
            message: "Bike was updated successfully.",
        });
    } else {
        res.status(400).json({
            message: `Bike with bikeId ${bikeId} could not be updated.`,
        });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let priceMin = req.query.priceMin;
    let priceMax = req.query.priceMax;
    let isInUse = req.query.isInUse;

    if (search) {
        condition[Sequelize.Op.or] = [
            { bikeId: { [Sequelize.Op.like]: `%${search}%` } },
            { name: { [Sequelize.Op.like]: `%${search}%` } },
            { condition: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    // we can safely assume that priceMin can only be added to conditions where
    // Sequelize.Op.and does not already exist, and only check here.
    if (priceMin) {
        condition[Sequelize.Op.and] = [
            { rentalPrice: { [Sequelize.Op.gte]: priceMin } },
        ];
    }

    if (priceMax) {
        if (condition[Sequelize.Op.and]) {
            condition[Sequelize.Op.and].push({
                rentalPrice: { [Sequelize.Op.lte]: priceMax },
            });
        } else {
            condition[Sequelize.Op.and] = [
                { rentalPrice: { [Sequelize.Op.lte]: priceMax } },
            ];
        }
    }

    if (isInUse) {
        isInUse = isInUse === "true" ? true : false;

        if (condition[Sequelize.Op.and]) {
            condition[Sequelize.Op.and].push({
                currentlyInUse: { [Sequelize.Op.eq]: isInUse },
            });
        } else {
            condition[Sequelize.Op.and] = [
                { currentlyInUse: { [Sequelize.Op.eq]: isInUse } },
            ];
        }
    }

    let list = await Bike.findAll({
        where: condition,
        order: [["createdAt", "DESC"]],
    });

    res.json(list);
});

router.get("/rentable", async (req, res) => {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const maxDistance = parseFloat(req.query.maxDistance);

    let condition = {
        [Sequelize.Op.and]: [
            { currentlyInUse: false },
            {
                bikeLat: {
                    [Sequelize.Op.ne]: null,
                },
            },
            {
                bikeLon: {
                    [Sequelize.Op.ne]: null,
                },
            },
        ],
    };

    let rentableBikes = await Bike.findAll({
        where: condition,
        order: [["createdAt", "DESC"]],
    });

    if (latitude && longitude && maxDistance) {
        let nearestBikes = rentableBikes.map((sequelizeObj) =>
            sequelizeObj.get({ plain: true })
        );
        nearestBikes.forEach((bike) => {
            bike.distance = calculateDistance(
                latitude,
                longitude,
                bike.bikeLat,
                bike.bikeLon
            );
        });
        nearestBikes = nearestBikes.filter((bike) => {
            return bike.distance <= maxDistance;
        });
        res.json(nearestBikes);
    } else {
        res.json(rentableBikes);
    }
});

router.get("/:bikeId", async (req, res) => {
    let bikeId = req.params.bikeId;
    let bike = await Bike.findByPk(bikeId);

    // check if bike does not exist
    if (!bike) {
        res.sendStatus(404);
        return;
    }
    // else return bike
    res.json(bike);
});

router.delete("/:bikeId", validateToken, async (req, res) => {
    let bikeId = req.params.bikeId;

    let bikeExists = await Bike.findByPk(bikeId);
    if (!bikeExists) {
        res.sendStatus(404);
        return;
    }

    let numDestroyed = await Bike.destroy({
        where: { bikeId: bikeId },
    });
    if (numDestroyed == 1) {
        res.json({
            message: "Bike was deleted successfully.",
        });
    } else {
        res.status(400).json({
            message: `Cannot delete bike with bikeid ${bikeId}.`,
        });
    }
});

module.exports = router;
