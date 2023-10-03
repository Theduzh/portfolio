"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const db = {};
require("dotenv").config();

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
        timezone: "+08:00",
    },
);

fs.readdirSync(__dirname)
    .filter((file) => {
        // First condition ensures referenced file is not a hidden file
        return (
            file.indexOf(".") !== 0 &&
            // Second condition ensures referenced file is not current file (index.js)
            file !== basename &&
            // Third condition ensures referenced file is a JS file
            file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        // Each file will return a function which will instantiate a corresponding table for each file
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
