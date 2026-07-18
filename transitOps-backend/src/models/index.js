import sequelize from "../config/database.js";

import Role from "./Role.js";
import User from "./User.js";
import Vehicle from "./Vehicle.js";
import Driver from "./Driver.js";
import Trip from "./Trip.js";

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
};

export default db;