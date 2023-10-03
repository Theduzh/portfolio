module.exports = (sequelize, DataTypes) => {
    const FaultReport = sequelize.define("FaultReport", {
        faultReportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        faultReportDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        faultReportStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        faultReportDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        faultReportResolvedDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    FaultReport.associate = (models) => {
        FaultReport.belongsTo(models.Bike, {
            foreignKey: "bikeId",
            as: "bike",
        });

        FaultReport.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return FaultReport;
};
