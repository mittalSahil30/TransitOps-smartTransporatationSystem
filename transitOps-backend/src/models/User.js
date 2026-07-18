import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "role_id",
        },

        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
            validate: {
                notEmpty: {
                    msg: "First name is required",
                },
            },
        },

        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
            validate: {
                notEmpty: {
                    msg: "Last name is required",
                },
            },
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: {
                msg: "Email already exists",
            },
            validate: {
                isEmail: {
                    msg: "Invalid email",
                },
                notEmpty: {
                    msg: "Email is required",
                },
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: "is_active",
        },

        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "last_login",
        },
    },
    {
        tableName: "users",

        timestamps: true,

        freezeTableName: true,

        defaultScope: {
            attributes: {
                exclude: ["password"],
            },
        },

        scopes: {
            withPassword: {
                attributes: {
                    include: ["password"],
                },
            },
        },
    }
);

/*
|--------------------------------------------------------------------------
| HASH PASSWORD BEFORE CREATE
|--------------------------------------------------------------------------
*/

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);
});

/*
|--------------------------------------------------------------------------
| HASH PASSWORD BEFORE UPDATE
|--------------------------------------------------------------------------
*/

User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt);
    }
});

/*
|--------------------------------------------------------------------------
| INSTANCE METHOD
|--------------------------------------------------------------------------
*/

User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;