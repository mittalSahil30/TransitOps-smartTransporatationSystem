import sequelize from "../config/database.js";

import Role from "./Role.js";
import User from "./User.js";
import Vehicle from "./Vehicle.js";
import Driver from "./Driver.js";
import Trip from "./Trip.js";
import Maintenance from "./Maintaince.js";
import Fuel from "./Fuel.js";
import Expense from "./Expense.js";

/*
|--------------------------------------------------------------------------
| User ↔ Role
|--------------------------------------------------------------------------
*/

Role.hasMany(User, {
    foreignKey: "roleId",
    as: "users",
});

User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
});

/*
|--------------------------------------------------------------------------
| Vehicle ↔ Trip
|--------------------------------------------------------------------------
*/

Vehicle.hasMany(Trip, {
    foreignKey: "vehicleId",
    as: "trips",
});

Trip.belongsTo(Vehicle, {
    foreignKey: "vehicleId",
    as: "vehicle",
});

/*
|--------------------------------------------------------------------------
| Driver ↔ Trip
|--------------------------------------------------------------------------
*/

Driver.hasMany(Trip, {
    foreignKey: "driverId",
    as: "trips",
});

Trip.belongsTo(Driver, {
    foreignKey: "driverId",
    as: "driver",
});

Vehicle.hasMany(
    Maintenance,
    {
        foreignKey: "vehicleId",
        as: "maintenanceRecords"
    }
);

Maintenance.belongsTo(
    Vehicle,
    {
        foreignKey: "vehicleId",
        as : "vehicle",
    }
);

Vehicle.hasMany(Fuel, {
    foreignKey: "vehicleId",
    as: "fuelLogs"
});

Fuel.belongsTo(Vehicle, {
    foreignKey: "vehicleId",
    as: "vehicle"
});

Trip.hasMany(Fuel, {
    foreignKey: "tripId",
    as: "fuelLogs"
});

Fuel.belongsTo(Trip, {
    foreignKey: "tripId",
    as: "trip"
});


Vehicle.hasMany(Expense, {
    foreignKey: "vehicleId",
    as: "expenses"
});

Expense.belongsTo(Vehicle, {
    foreignKey: "vehicleId",
    as: "vehicle"
});

Trip.hasMany(Expense, {
    foreignKey: "tripId",
    as: "expenses"
});

Expense.belongsTo(Trip, {
    foreignKey: "tripId",
    as: "trip"
});



/*
|--------------------------------------------------------------------------
| Export Models
|--------------------------------------------------------------------------
*/

const db = {

    sequelize,
    Role,
    User,
    Vehicle,
    Driver,
    Trip,
    Maintenance,
    Fuel,
    Expense,
};




export default db;

