const express = require("express");
const axios = require("axios");
const router = express.Router();
const { validateToken } = require("../middleware/auth");

// https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf

const datamallEndpoint = "http://datamall2.mytransport.sg/ltaodataservice/";
const config = {
    headers: {
        AccountKey: process.env.DATAMALL_SECRET,
        accept: "application/json",
    },
};

router.get("/TrainServiceAlerts", validateToken, async (req, res) => {
    axios
        .get(datamallEndpoint + "TrainServiceAlerts", config)
        .then((resp) => res.json(resp.data.value))
        .catch((err) => console.log(err));
});

router.get("/TrafficIncidents", validateToken, async (req, res) => {
    axios
        .get(datamallEndpoint + "TrafficIncidents", config)
        .then((resp) => res.json(resp.data.value))
        .catch((err) => console.log(err));
});

module.exports = router;
