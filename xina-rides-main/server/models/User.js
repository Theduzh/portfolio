module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define("User", {
        firstName: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        password: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        gender: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: Datatypes.DATE,
            allowNull: true,
        },
        xcredit: {
            type: Datatypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        xcreditEarned: {
            type: Datatypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        phoneNo: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        aboutMe: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        profilePic: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        twoFAEnabled: {
            type: Datatypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        wallet: {
            type: Datatypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        stripe_account_id: {
            type: Datatypes.STRING
        },
        deletedAt: {
            type: Datatypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        paranoid: true,

    });

    User.associate = (models) => {
        User.belongsToMany(models.Rewards, {
            through: { model: "User_Rewards", unique: false },
            through: "User_Rewards",
            onDelete: "cascade",
        });

        User.belongsToMany(models.Promotion, {
            through: "User_Promotion",
        });

        User.hasMany(models.Order, {
            foreignKey: "userId",
            onDelete: "cascade",
        });

        User.belongsTo(models.AccountType, {
            foreignKey: "accountType",
            onDelete: "no action",
        });

        User.hasMany(models.WalletTransactions, {
            foreignKey: "userId",
            onDelete: "no action"
        })

        User.hasMany(models.Notification, {
            foreignKey: "userId",
            onDelete: "no action",
        });
    };
    return User;
};
