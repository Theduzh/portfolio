const express = require("express");
const cors = require("cors");
const db = require("./models");

require("dotenv").config();

const app = express();
app.use(cors());

const UserRoute = require("./routes/user");
const OrderRoute = require("./routes/order");
const BikeRoute = require("./routes/bike");
const TimingsRoute = require("./routes/timings");
const rewardsRoute = require("./routes/rewards");
const fileRoute = require("./routes/file");
const PromotionRoute = require("./routes/promotion");
const EmailPromotionRoute = require("./routes/promotion_email");
const UserRewardsRoute = require("./routes/user_rewards");
const CheckoutRoute = require("./routes/checkout");
const UserPromotionRoute = require("./routes/user_promotion");
const NotificationRoute = require("./routes/notification");
const WebhookRoute = require("./routes/webhook");
const publicTransportStatus = require("./routes/publicTransportStatus");
const faultReportRoute = require("./routes/faultreport");

app.get("/", (req, res) => {
    res.send("Welcome to XINA Rides.");
});

app.use("/webhook", WebhookRoute);
app.use("/ptstatus", publicTransportStatus);

// Routes
// app.use("/landingpage", LandingPageRoute);

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to XINA Rides.");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/user", UserRoute);
app.use("/rewards", rewardsRoute);
app.use("/bike", BikeRoute);
app.use("/order", OrderRoute);
app.use("/timings", TimingsRoute);
app.use("/promotion", PromotionRoute);
app.use("/file", fileRoute);
app.use("/userrewards", UserRewardsRoute);
app.use("/checkout", CheckoutRoute);
app.use("/user_promotion", UserPromotionRoute);
app.use("/email_promotion", EmailPromotionRoute);
app.use("/notification", NotificationRoute);
app.use("/fault-report", faultReportRoute);

db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Server running on http://localhost:${port}`);
    });
});
