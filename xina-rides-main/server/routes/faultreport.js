const express = require("express");
const router = express.Router();
const yup = require("yup");
const { validateToken } = require("../middleware/auth.js");
const { FaultReport, Sequelize } = require("../models");

router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    let validationSchema = yup.object().shape({
        faultReportDescription: yup.string().trim().max(300).required(),
        bikeId: yup.number().required(),
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

    data.faultReportDescription = data.faultReportDescription.trim();
    data.faultReportStatus = "OPEN";
    data.faultReportDate = new Date();
    data.faultReportResolvedDate = null;
    data.userId = req.user.id;
    data.bikeId = parseInt(data.bikeId);

    try {
        await validationSchema.validate(data, {
            abortEarly: false,
            strict: true,
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    const faultReport = await FaultReport.create(data);

    res.json(faultReport);
});

router.get("/:faultReportId", async (req, res) => {
    const faultReportId = req.params.faultReportId;

    try {
        const faultReport = await FaultReport.findOne({
            where: {
                faultReportId: faultReportId,
            },
        });

        if (!faultReport) {
            return res.status(404).send({
                error: {
                    message: "Fault report not found.",
                },
            });
        }

        res.json(faultReport);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
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
            { faultReportId: { [Sequelize.Op.like]: `%${search}%` } },
            { faultReportStatus: { [Sequelize.Op.like]: `%${search}%` } },
        ];
    }

    const { faultReportStatus, faultReportDate, faultReportResolvedDate } =
        req.query;

    if (faultReportStatus) {
        condition.faultReportStatus = faultReportStatus;
    }

    if (faultReportDate) {
        condition.faultReportDate = { [Sequelize.Op.gte]: faultReportDate };
    }

    if (faultReportResolvedDate) {
        condition.faultReportResolvedDate = {
            [Sequelize.Op.lte]: faultReportResolvedDate,
        };
    }

    try {
        const faultReports = await FaultReport.findAll({
            where: condition,
            order: [["createdAt", "ASC"]],
        });

        res.json(faultReports);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/my-fault-reports", validateToken, async (req, res) => {
    const userId = req.user.id;
    console.log(userId);

    try {
        const faultReports = await FaultReport.findAll({
            where: {
                userId: userId,
            },
            order: [["createdAt", "ASC"]],
        });

        res.json(faultReports);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.put("/:faultReportId/mark", validateToken, async (req, res) => {
    const faultReportId = req.params.faultReportId;
    const data = req.body;

    try {
        const faultReport = await FaultReport.findOne({
            where: {
                faultReportId: faultReportId,
            },
        });

        if (!faultReport) {
            return res.status(404).send({
                error: {
                    message: "Fault report not found.",
                },
            });
        }

        faultReport.faultReportStatus = data.status.trim().toUpperCase();
        if (faultReport.faultReportStatus === "RESOLVED") {
            faultReport.faultReportResolvedDate = new Date();
        } else {
            faultReport.faultReportResolvedDate = null;
        }

        await faultReport.save();

        res.send(faultReport);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

module.exports = router;
