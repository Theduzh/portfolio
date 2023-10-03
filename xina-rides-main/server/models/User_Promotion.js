module.exports = (sequelize, DataTypes) => {
    const User_Promotion = sequelize.define("User_Promotion", {
        user_uses: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        promotion_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stripe_coupon_id: {
            type: DataTypes.STRING,
        },
        stripe_promotion_id: {
            type: DataTypes.STRING,
        },
    });

    sequelize.sync();
    return User_Promotion;
};
