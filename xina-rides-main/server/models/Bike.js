module.exports = (sequelize, DataTypes) => {
    const Bike = sequelize.define(
        "Bike",
        {
            bikeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            currentlyInUse: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            rentalPrice: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            condition: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            bikeLat: {
                type: DataTypes.DECIMAL(10, 6),
                allowNull: true,
            },
            bikeLon: {
                type: DataTypes.DECIMAL(10, 6),
                allowNull: true,
            },
        },
        {
            initialAutoIncrement: 1,
            paranoid: true,
        }
    );

    Bike.associate = (models) => {
        Bike.hasMany(models.Order, {
            foreignKey: "bikeId",
            // as record needs to match on both modelsnp
            as: "bike",
        });
    };

    return Bike;
};
