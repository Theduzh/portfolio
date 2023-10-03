module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        notificationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false, // RENTAL, RETURN, CANCELLED
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false, // UNREAD, READ
        },
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return Notification;
};
