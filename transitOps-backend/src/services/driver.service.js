import { Op } from "sequelize";
import Driver from "../models/Driver.js";
import ApiError from "../utils/ApiError.js";
import {
    DRIVER_STATUS,
    DRIVER_SORT_FIELDS
} from "../utils/constants.js";

class DriverService {

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | Find Driver
    |--------------------------------------------------------------------------
    */

    async findDriver(id) {

        const driver = await Driver.findOne({

            where: {

                id,

                isDeleted: false

            }

        });

        if (!driver) {

            throw new ApiError(

                404,

                "Driver not found."

            );

        }

        return driver;

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | Duplicate Check
    |--------------------------------------------------------------------------
    */

    async checkDuplicate(field, value, driverId = null) {

        if (!value) return;

        const where = {

            [field]: value,

            isDeleted: false

        };

        if (driverId) {

            where.id = {

                [Op.ne]: driverId

            };

        }

        const exists = await Driver.findOne({

            where

        });

        if (exists) {

            const labels = {

                employeeId: "Employee ID",

                email: "Email",

                licenseNumber: "License Number"

            };

            throw new ApiError(

                409,

                `${labels[field]} already exists.`

            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | Validate License Expiry
    |--------------------------------------------------------------------------
    */

    validateLicenseExpiry(expiryDate) {

        const expiry = new Date(expiryDate);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (expiry <= today) {

            throw new ApiError(

                400,

                "License expiry date must be a future date."

            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE
    | Build Filter
    |--------------------------------------------------------------------------
    */

    buildFilter(query = {}) {

        const where = {

            isDeleted: false

        };

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (query.search) {

            where[Op.or] = [

                {

                    employeeId: {

                        [Op.like]: `%${query.search}%`

                    }

                },

                {

                    firstName: {

                        [Op.like]: `%${query.search}%`

                    }

                },

                {

                    lastName: {

                        [Op.like]: `%${query.search}%`

                    }

                },

                {

                    email: {

                        [Op.like]: `%${query.search}%`

                    }

                },

                {

                    licenseNumber: {

                        [Op.like]: `%${query.search}%`

                    }

                }

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        if (query.status) {

            where.status = query.status;

        }

        /*
        |--------------------------------------------------------------------------
        | Region
        |--------------------------------------------------------------------------
        */

        if (query.region) {

            where.region = query.region;

        }

        return where;

    }

    /*
    |--------------------------------------------------------------------------
    | CREATE DRIVER
    |--------------------------------------------------------------------------
    */

    async createDriver(data) {

        /*
        |--------------------------------------------------------------------------
        | Validate License
        |--------------------------------------------------------------------------
        */

        this.validateLicenseExpiry(

            data.licenseExpiry

        );

        /*
        |--------------------------------------------------------------------------
        | Duplicate Checks
        |--------------------------------------------------------------------------
        */

        await this.checkDuplicate(

            "employeeId",

            data.employeeId

        );

        await this.checkDuplicate(

            "email",

            data.email

        );

        await this.checkDuplicate(

            "licenseNumber",

            data.licenseNumber

        );

        /*
        |--------------------------------------------------------------------------
        | Create
        |--------------------------------------------------------------------------
        */

        const driver = await Driver.create({

            employeeId: data.employeeId,

            firstName: data.firstName,

            lastName: data.lastName,

            email: data.email,

            phone: data.phone,

            licenseNumber: data.licenseNumber,

            licenseExpiry: data.licenseExpiry,

            joiningDate: data.joiningDate,

            region: data.region,

            status:

                data.status ||

                DRIVER_STATUS.AVAILABLE

        });

        return driver.toJSON();

    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE DRIVER
    |--------------------------------------------------------------------------
    */

    async updateDriver(id, data) {

        const driver = await this.findDriver(id);

        /*
        |--------------------------------------------------------------------------
        | License Validation
        |--------------------------------------------------------------------------
        */

        if (data.licenseExpiry) {

            this.validateLicenseExpiry(

                data.licenseExpiry

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Duplicate Checks
        |--------------------------------------------------------------------------
        */

        if (

            data.employeeId &&

            data.employeeId !== driver.employeeId

        ) {

            await this.checkDuplicate(

                "employeeId",

                data.employeeId,

                driver.id

            );

        }

        if (

            data.email &&

            data.email !== driver.email

        ) {

            await this.checkDuplicate(

                "email",

                data.email,

                driver.id

            );

        }

        if (

            data.licenseNumber &&

            data.licenseNumber !== driver.licenseNumber

        ) {

            await this.checkDuplicate(

                "licenseNumber",

                data.licenseNumber,

                driver.id

            );

        }

        await driver.update({

            employeeId:

                data.employeeId ??

                driver.employeeId,

            firstName:

                data.firstName ??

                driver.firstName,

            lastName:

                data.lastName ??

                driver.lastName,

            email:

                data.email ??

                driver.email,

            phone:

                data.phone ??

                driver.phone,

            licenseNumber:

                data.licenseNumber ??

                driver.licenseNumber,

            licenseExpiry:

                data.licenseExpiry ??

                driver.licenseExpiry,

            joiningDate:

                data.joiningDate ??

                driver.joiningDate,

            region:

                data.region ??

                driver.region,

            status:

                data.status ??

                driver.status

        });

        return driver.toJSON();

    }

    /*
|--------------------------------------------------------------------------
| GET DRIVER BY ID
|--------------------------------------------------------------------------
*/

async getDriverById(id) {

    const driver = await this.findDriver(id);

    return driver.toJSON();

}

/*
|--------------------------------------------------------------------------
| GET ALL DRIVERS
|--------------------------------------------------------------------------
*/

async getAllDrivers(query = {}) {

    const {

        page = 1,

        limit = 10,

        sortBy = "createdAt",

        order = "DESC"

    } = query;

    const where = this.buildFilter(query);

    const pageNumber = Number(page);

    const pageLimit = Number(limit);

    const offset = (pageNumber - 1) * pageLimit;

    /*
    |--------------------------------------------------------------------------
    | Safe Sorting
    |--------------------------------------------------------------------------
    */

    const sortField = DRIVER_SORT_FIELDS.includes(sortBy)

        ? sortBy

        : "createdAt";

    const sortOrder =

        order.toUpperCase() === "ASC"

            ? "ASC"

            : "DESC";

    const { rows, count } = await Driver.findAndCountAll({

        where,

        limit: pageLimit,

        offset,

        order: [

            [sortField, sortOrder]

        ]

    });

    return {

        drivers: rows.map(driver => driver.toJSON()),

        pagination: {

            page: pageNumber,

            limit: pageLimit,

            total: count,

            totalPages: Math.ceil(count / pageLimit)

        }

    };

}

/*
|--------------------------------------------------------------------------
| GET AVAILABLE DRIVERS
|--------------------------------------------------------------------------
*/

async getAvailableDrivers() {

    const drivers = await Driver.findAll({

        where: {

            isDeleted: false,

            status: DRIVER_STATUS.AVAILABLE

        },

        order: [

            ["firstName", "ASC"]

        ]

    });

    /*
    |--------------------------------------------------------------------------
    | Remove Expired Licenses
    |--------------------------------------------------------------------------
    */

    return drivers

        .filter(driver => !driver.isLicenseExpired())

        .map(driver => driver.toJSON());

}

/*
|--------------------------------------------------------------------------
| DELETE DRIVER
|--------------------------------------------------------------------------
*/

async deleteDriver(id) {

    const driver = await this.findDriver(id);

    /*
    |--------------------------------------------------------------------------
    | Business Rule
    |--------------------------------------------------------------------------
    */

    if (driver.status === DRIVER_STATUS.ON_TRIP) {

        throw new ApiError(

            400,

            "Driver is currently assigned to a trip."

        );

    }

    await driver.update({

        isDeleted: true

    });

    return {

        message: "Driver deleted successfully."

    };

}



}

export default new DriverService();