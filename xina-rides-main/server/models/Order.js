module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        rentalStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rentalEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rentalDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        orderTotal: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: true,
        },
        orderNotes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        orderPaymentStatus: {
            type: DataTypes.STRING,
            allowNull: false, // UNPAID, PAID
        },
        orderStatus: {
            type: DataTypes.STRING,
            allowNull: false, // PENDING, CANCELLED, COMPLETED
        },
        orderPaymentMethod: {
            type: DataTypes.STRING,
            allowNull: true, // Credit Card / Debit Card / PayNow
        },
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });

        Order.belongsTo(models.Bike, {
            foreignKey: "bikeId",
            as: "bike",
        });
    };

    return Order;
};
