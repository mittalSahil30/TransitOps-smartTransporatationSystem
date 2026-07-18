import { Op } from "sequelize";

import db from "../models/index.js";

import ApiError from "../utils/ApiError.js";

import {
    DRIVER_STATUS,
    VEHICLE_STATUS,
    TRIP_SORT_FIELDS
} from "../utils/constants.js";

const {
    sequelize,
    Trip,
    Driver,
    Vehicle,
} = db;

class TripService {

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | FIND TRIP
    |--------------------------------------------------------------------------
    */

    async findTrip(id, transaction = null) {

        const trip = await Trip.findOne({

            where: {

                id,

                isDeleted: false,

            },

            include: [

                {

                    model: Vehicle,

                    as: "vehicle",

                },

                {

                    model: Driver,

                    as: "driver",

                },

            ],

            transaction,

        });

        if (!trip) {

            throw new ApiError(

                404,

                "Trip not found."

            );

        }

        return trip;

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | CHECK DUPLICATE TRIP NUMBER
    |--------------------------------------------------------------------------
    */

    async checkTripNumber(tripNumber, tripId = null) {

        const where = {

            tripNumber,

            isDeleted: false,

        };

        if (tripId) {

            where.id = {

                [Op.ne]: tripId,

            };

        }

        const trip = await Trip.findOne({

            where,

        });

        if (trip) {

            throw new ApiError(

                409,

                "Trip number already exists."

            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | VALIDATE DRIVER
    |--------------------------------------------------------------------------
    */

    async validateDriver(driverId, transaction = null) {

        const driver = await Driver.findOne({

            where: {

                id: driverId,

                isDeleted: false,

            },

            transaction,

        });

        if (!driver) {

            throw new ApiError(

                404,

                "Driver not found."

            );

        }

        if (

            driver.status !==

            DRIVER_STATUS.AVAILABLE

        ) {

            throw new ApiError(

                400,

                "Driver is not available."

            );

        }

        if (

            driver.isLicenseExpired()

        ) {

            throw new ApiError(

                400,

                "Driver license has expired."

            );

        }

        return driver;

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | VALIDATE VEHICLE
    |--------------------------------------------------------------------------
    */

    async validateVehicle(vehicleId, transaction = null) {

        const vehicle = await Vehicle.findOne({

            where: {

                id: vehicleId,

                isDeleted: false,

            },

            transaction,

        });

        if (!vehicle) {

            throw new ApiError(

                404,

                "Vehicle not found."

            );

        }

        if (

            vehicle.status !==

            VEHICLE_STATUS.AVAILABLE

        ) {

            throw new ApiError(

                400,

                "Vehicle is not available."

            );

        }

        return vehicle;

    }

    /*
|--------------------------------------------------------------------------
| PRIVATE
| BUILD FILTER
|--------------------------------------------------------------------------
*/

buildFilter(query = {}) {

    const where = {

        isDeleted: false

    };

    if (query.search) {

        where[Op.or] = [

            {
                tripNumber: {
                    [Op.like]: `%${query.search}%`
                }
            },

            {
                origin: {
                    [Op.like]: `%${query.search}%`
                }
            },

            {
                destination: {
                    [Op.like]: `%${query.search}%`
                }
            }

        ];

    }

    if (query.status) {

        where.status = query.status;

    }

    if (query.vehicleId) {

        where.vehicleId = query.vehicleId;

    }

    if (query.driverId) {

        where.driverId = query.driverId;

    }

    return where;

}

    /*
|--------------------------------------------------------------------------
| CREATE TRIP
|--------------------------------------------------------------------------
*/

async createTrip(data) {

    /*
    |--------------------------------------------------------------------------
    | Duplicate Trip Number
    |--------------------------------------------------------------------------
    */

    await this.checkTripNumber(data.tripNumber);

    /*
    |--------------------------------------------------------------------------
    | Database Transaction
    |--------------------------------------------------------------------------
    */

    const transaction = await sequelize.transaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Validate Driver
        |--------------------------------------------------------------------------
        */

        const driver = await this.validateDriver(
            data.driverId,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Vehicle
        |--------------------------------------------------------------------------
        */

        const vehicle = await this.validateVehicle(
            data.vehicleId,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Distance Validation
        |--------------------------------------------------------------------------
        */

        if (Number(data.distance) <= 0) {

            throw new ApiError(
                400,
                "Distance must be greater than zero."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Cargo Weight Validation
        |--------------------------------------------------------------------------
        */

        if (Number(data.cargoWeight) < 0) {

            throw new ApiError(
                400,
                "Cargo weight cannot be negative."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Departure / Arrival Validation
        |--------------------------------------------------------------------------
        */

        const departureTime = new Date(data.departureTime);

        const expectedArrival = new Date(data.expectedArrival);

        if (expectedArrival <= departureTime) {

            throw new ApiError(
                400,
                "Expected arrival must be after departure time."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Odometer Validation
        |--------------------------------------------------------------------------
        */

        if (

            Number(data.startOdometer) <

            Number(vehicle.odometer)

        ) {

            throw new ApiError(

                400,

                "Start odometer cannot be less than current vehicle odometer."

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Create Draft Trip
        |--------------------------------------------------------------------------
        */

        const trip = await Trip.create(

            {

                tripNumber: data.tripNumber,

                vehicleId: vehicle.id,

                driverId: driver.id,

                origin: data.origin,

                destination: data.destination,

                departureTime: data.departureTime,

                expectedArrival: data.expectedArrival,

                cargoWeight: data.cargoWeight,

                distance: data.distance,

                startOdometer: data.startOdometer,

                remarks: data.remarks || null,

            },

            {

                transaction,

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Commit Transaction
        |--------------------------------------------------------------------------
        */

        await transaction.commit();

        /*
        |--------------------------------------------------------------------------
        | Return Complete Object
        |--------------------------------------------------------------------------
        */

        return await this.findTrip(trip.id);

    }

    catch (error) {

        await transaction.rollback();

        throw error;

    }

}
/*
|--------------------------------------------------------------------------
| DISPATCH TRIP
|--------------------------------------------------------------------------
*/

async dispatchTrip(id) {

    const transaction = await sequelize.transaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Find Trip
        |--------------------------------------------------------------------------
        */

        const trip = await this.findTrip(
            id,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Status
        |--------------------------------------------------------------------------
        */

        if (!trip.isDraft()) {

            throw new ApiError(
                400,
                "Only draft trips can be dispatched."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Driver Again
        |--------------------------------------------------------------------------
        */

        const driver = await this.validateDriver(
            trip.driverId,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Vehicle Again
        |--------------------------------------------------------------------------
        */

        const vehicle = await this.validateVehicle(
            trip.vehicleId,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Update Trip
        |--------------------------------------------------------------------------
        */

        await trip.update(
            {
                status: TRIP_STATUS.DISPATCHED
            },
            {
                transaction
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Update Driver
        |--------------------------------------------------------------------------
        */

        await driver.update(
            {
                status: DRIVER_STATUS.ON_TRIP
            },
            {
                transaction
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Update Vehicle
        |--------------------------------------------------------------------------
        */

        await vehicle.update(
            {
                status: VEHICLE_STATUS.ON_TRIP
            },
            {
                transaction
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Commit
        |--------------------------------------------------------------------------
        */

        await transaction.commit();

        const dispatchedTrip = await this.findTrip(id);

        return dispatchedTrip.toJSON();

    } catch (error) {

        await transaction.rollback();

        throw error;

    }

}

/*
|--------------------------------------------------------------------------
| COMPLETE TRIP
|--------------------------------------------------------------------------
*/

async completeTrip(id, data) {

    const transaction = await sequelize.transaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Find Trip
        |--------------------------------------------------------------------------
        */

        const trip = await this.findTrip(
            id,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Business Rule
        |--------------------------------------------------------------------------
        */

        if (!trip.isDispatched()) {

            throw new ApiError(
                400,
                "Only dispatched trips can be completed."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Load Driver & Vehicle
        |--------------------------------------------------------------------------
        */

        const driver = await Driver.findOne({

            where: {

                id: trip.driverId,

                isDeleted: false

            },

            transaction

        });

        const vehicle = await Vehicle.findOne({

            where: {

                id: trip.vehicleId,

                isDeleted: false

            },

            transaction

        });

        if (!driver) {

            throw new ApiError(
                404,
                "Driver not found."
            );

        }

        if (!vehicle) {

            throw new ApiError(
                404,
                "Vehicle not found."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Arrival Time
        |--------------------------------------------------------------------------
        */

        const departure = new Date(
            trip.departureTime
        );

        const actualArrival = new Date(
            data.actualArrival
        );

        if (actualArrival <= departure) {

            throw new ApiError(
                400,
                "Actual arrival must be after departure time."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Validate End Odometer
        |--------------------------------------------------------------------------
        */

        if (

            Number(data.endOdometer) <

            Number(trip.startOdometer)

        ) {

            throw new ApiError(

                400,

                "End odometer cannot be less than start odometer."

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Complete Trip
        |--------------------------------------------------------------------------
        */

        await trip.update(

            {

                status: TRIP_STATUS.COMPLETED,

                actualArrival: data.actualArrival,

                endOdometer: data.endOdometer,

                remarks:

                    data.remarks ??

                    trip.remarks

            },

            {

                transaction

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Update Vehicle
        |--------------------------------------------------------------------------
        */

        await vehicle.update(

            {

                status: VEHICLE_STATUS.AVAILABLE,

                odometer: data.endOdometer

            },

            {

                transaction

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Update Driver
        |--------------------------------------------------------------------------
        */

        await driver.update(

            {

                status: DRIVER_STATUS.AVAILABLE

            },

            {

                transaction

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Commit
        |--------------------------------------------------------------------------
        */

        await transaction.commit();

        const completedTrip = await this.findTrip(id);

        return completedTrip.toJSON();

    }

    catch (error) {

        await transaction.rollback();

        throw error;

    }

}
/*
|--------------------------------------------------------------------------
| CANCEL TRIP
|--------------------------------------------------------------------------
*/

async cancelTrip(id, remarks = null) {

    const transaction = await sequelize.transaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Find Trip
        |--------------------------------------------------------------------------
        */

        const trip = await this.findTrip(
            id,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Business Rule
        |--------------------------------------------------------------------------
        */

        if (!trip.isDraft()) {

            throw new ApiError(
                400,
                "Only draft trips can be cancelled."
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Cancel Trip
        |--------------------------------------------------------------------------
        */

        await trip.update(

            {

                status: TRIP_STATUS.CANCELLED,

                remarks: remarks ?? trip.remarks

            },

            {

                transaction

            }

        );

        /*
        |--------------------------------------------------------------------------
        | Commit Transaction
        |--------------------------------------------------------------------------
        */

        await transaction.commit();

        const cancelledTrip = await this.findTrip(id);

        return cancelledTrip.toJSON();

    }

    catch (error) {

        await transaction.rollback();

        throw error;

    }

}
/*
|--------------------------------------------------------------------------
| GET TRIP BY ID
|--------------------------------------------------------------------------
*/

async getTripById(id) {

    const trip = await this.findTrip(id);

    return trip.toJSON();

}

/*
|--------------------------------------------------------------------------
| GET ALL TRIPS
|--------------------------------------------------------------------------
*/

async getAllTrips(query = {}) {

    const {
        page = 1,
        limit = 10,
        search,
        status,
        vehicleId,
        driverId,
        sortBy = "createdAt",
        order = "DESC"
    } = query;

    /*
    |--------------------------------------------------------------------------
    | Build Filters
    |--------------------------------------------------------------------------
    */

    const where = {
        isDeleted: false
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

        where[Op.or] = [
            {
                tripNumber: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                origin: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                destination: {
                    [Op.like]: `%${search}%`
                }
            }
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    if (status) {
        where.status = status;
    }

    if (vehicleId) {

        where.vehicleId = vehicleId;
    }
    if (driverId) {
        where.driverId = driverId;
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const offset = (pageNumber - 1) * pageLimit;

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    const sortField =
        TRIP_SORT_FIELDS.includes(sortBy)
            ? sortBy
            : "createdAt";
    const sortOrder =
        order.toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    /*
    |--------------------------------------------------------------------------
    | Query
    |--------------------------------------------------------------------------
    */

    const {
        rows,
        count
    } = await Trip.findAndCountAll({
        where,
        include: [
            {
                model: Driver,
                as: "driver"
            },
            {
                model: Vehicle,
                as: "vehicle"
            }
        ],
        limit: pageLimit,
        offset,
        order: [
            [
                sortField,
                sortOrder
            ]
        ]
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {
        trips: rows.map(
            trip => trip.toJSON()
        ),
        pagination: {
            page: pageNumber,
            limit: pageLimit,
            total: count,
            totalPages:
                Math.ceil(
                    count / pageLimit
                )
        }
    };
}
/*
|--------------------------------------------------------------------------
| DELETE TRIP
|--------------------------------------------------------------------------
*/

async deleteTrip(id) {

    /*
    |--------------------------------------------------------------------------
    | Find Trip
    |--------------------------------------------------------------------------
    */

    const trip = await this.findTrip(id);

    /*
    |--------------------------------------------------------------------------
    | Business Rules
    |--------------------------------------------------------------------------
    */

    if (trip.isDispatched()) {

        throw new ApiError(

            400,

            "A dispatched trip cannot be deleted."

        );

    }

    if (trip.isCompleted()) {

        throw new ApiError(

            400,

            "A completed trip cannot be deleted."

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */

    await trip.update({

        isDeleted: true

    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return {

        message: "Trip deleted successfully."

    };

}

}

export default new TripService();