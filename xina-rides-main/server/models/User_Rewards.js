const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./User");
const Rewards = require("./Rewards");

module.exports = (sequelize, Datatypes) => {
    const User_Rewards = sequelize.define(
        "User_Rewards",
        {
            id: {
                type: Datatypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            RewardId: {
                type: Datatypes.INTEGER,
                references: {
                    model: User,
                    key: "id",
                },
            },
            UserId: {
                type: Datatypes.INTEGER,
                references: {
                    model: Rewards,
                    key: "id",
                },
            },
            Used: {
                type: Datatypes.BOOLEAN,
                allowNull: false,
            },
        },
    );

    sequelize.sync();
    return User_Rewards;
};
