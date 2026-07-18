import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { TRIP_STATUS } from "../utils/constants.js";

const Trip = sequelize.define(
    "Trip",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        tripNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            field: "trip_number",
            validate: {
                notEmpty: {
                    msg: "Trip Number is required.",
                },
            },
        },

        vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "vehicle_id",
        },

        driverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "driver_id",
        },

        origin: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        destination: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        departureTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "departure_time",
        },

        expectedArrival: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expected_arrival",
        },

        actualArrival: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "actual_arrival",
        },

        cargoWeight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            field: "cargo_weight",
        },

        distance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        startOdometer: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: "start_odometer",
        },

        endOdometer: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            field: "end_odometer",
        },

        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                TRIP_STATUS.DRAFT,
                TRIP_STATUS.DISPATCHED,
                TRIP_STATUS.COMPLETED,
                TRIP_STATUS.CANCELLED
            ),
            defaultValue: TRIP_STATUS.DRAFT,
        },

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "is_deleted",
        },
    },
    {
        tableName: "trips",

        freezeTableName: true,

        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ["trip_number"],
            },
            {
                fields: ["vehicle_id"],
            },
            {
                fields: ["driver_id"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["departure_time"],
            },
        ],
    }
);

/*
|--------------------------------------------------------------------------
| Instance Methods
|--------------------------------------------------------------------------
*/

Trip.prototype.isDraft = function () {
    return this.status === TRIP_STATUS.DRAFT;
};

Trip.prototype.isDispatched = function () {
    return this.status === TRIP_STATUS.DISPATCHED;
};

Trip.prototype.isCompleted = function () {
    return this.status === TRIP_STATUS.COMPLETED;
};

Trip.prototype.isCancelled = function () {
    return this.status === TRIP_STATUS.CANCELLED;
};

export default Trip;