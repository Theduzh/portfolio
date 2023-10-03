module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define("Promotion", {
        promotion_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        promotion_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        promotion_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        discount_amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_uses: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image_file: {
            type: DataTypes.STRING,
        },
        card_image: {
            type: DataTypes.STRING,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });
    Promotion.associate = (models) => {
        Promotion.belongsToMany(models.User, {
            through: "User_Promotion",
        });
    };
    return Promotion;
}
