module.exports = (sequelize, Datatypes) => {
    const AccountType = sequelize.define("AccountType",
        {
            accountType: {
                type: Datatypes.STRING
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false
        }
    );

    AccountType.associate = (models) => {
        AccountType.hasMany(models.User, {
            onDelete: "cascade"
        })
    }

    return AccountType;
}