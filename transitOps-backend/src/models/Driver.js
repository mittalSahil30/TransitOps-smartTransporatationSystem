import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { DRIVER_STATUS } from "../utils/constants.js";

const Driver = sequelize.define(
    "Driver",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        employeeId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            field: "employee_id",
            validate: {
                notEmpty: {
                    msg: "Employee ID is required.",
                },
            },
        },

        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
            validate: {
                notEmpty: {
                    msg: "First name is required.",
                },
            },
        },

        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
            validate: {
                notEmpty: {
                    msg: "Last name is required.",
                },
            },
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Invalid email address.",
                },
            },
        },

        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        licenseNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: "license_number",
        },

        licenseExpiry: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "license_expiry",
        },

        joiningDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "joining_date",
        },

        region: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                DRIVER_STATUS.AVAILABLE,
                DRIVER_STATUS.ON_TRIP,
                DRIVER_STATUS.OFF_DUTY,
                DRIVER_STATUS.SUSPENDED
            ),
            defaultValue: DRIVER_STATUS.AVAILABLE,
        },

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "is_deleted",
        },
    },
    {
        tableName: "drivers",

        freezeTableName: true,

        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ["employee_id"],
            },
            {
                unique: true,
                fields: ["email"],
            },
            {
                unique: true,
                fields: ["license_number"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["region"],
            },
            {
                fields: ["license_expiry"],
            },
        ],
    }
);

/*
|--------------------------------------------------------------------------
| Instance Methods
|--------------------------------------------------------------------------
*/

Driver.prototype.isLicenseExpired = function () {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return new Date(this.licenseExpiry) < today;

};

Driver.prototype.isAvailable = function () {

    return (

        this.status === DRIVER_STATUS.AVAILABLE &&

        !this.isLicenseExpired() &&

        !this.isDeleted

    );

};

export default Driver;