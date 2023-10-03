const { DataTypes } = require("sequelize");

module.exports = (sequelize, Datatypes) => {
    const Rewards = sequelize.define("Rewards", {
        header: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        category: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        title: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        titleSubhead: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        description: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        discount: {
            type: Datatypes.DECIMAL(5, 2),
            allowNull: false,
        },
        xcredit: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        expiryDate: {
            type: Datatypes.DATEONLY,
            allowNull: false,
        },
        imageFile: {
            type: Datatypes.STRING
        }
    }, {
        paranoid: true,
    });

    Rewards.associate = (models) => {
        Rewards.belongsToMany(models.User, {
            through: {model: "User_Rewards", unique: false},
        })
    }

    return Rewards;
};
