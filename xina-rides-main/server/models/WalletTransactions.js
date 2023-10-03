module.exports = (sequelize, Datatypes) => {
    const WalletTransactions = sequelize.define("WalletTransactions", {
        orderID: {
            type: Datatypes.STRING,
            allowNull: false,
            defaultValue: "N/A"
        },
        description: {
            type: Datatypes.STRING,
            allowNull: false
        },
        amount: {
            type: Datatypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentMethod: {
            type: Datatypes.STRING,
            allowNull: false
        }
    })

    WalletTransactions.associate = (models) => {
        WalletTransactions.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade"
        })
    }

    return WalletTransactions;
}