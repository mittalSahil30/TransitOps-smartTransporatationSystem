import express from "express";

import driverController from "../controllers/driver.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validator from "../middleware/validator.js";

import {
    createDriverValidator,
    updateDriverValidator,
} from "../validators/driver.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL DRIVERS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    driverController.getAllDrivers
);

/*
|--------------------------------------------------------------------------
| AVAILABLE DRIVERS
|--------------------------------------------------------------------------
*/

router.get(
    "/available",
    authenticate,
    driverController.getAvailableDrivers
);

/*
|--------------------------------------------------------------------------
| GET DRIVER BY ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    authenticate,
    driverController.getDriverById
);

/*
|--------------------------------------------------------------------------
| CREATE DRIVER
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager"
    ),
    createDriverValidator,
    validator,
    driverController.createDriver
);

/*
|--------------------------------------------------------------------------
| UPDATE DRIVER
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager"
    ),
    updateDriverValidator,
    validator,
    driverController.updateDriver
);

/*
|--------------------------------------------------------------------------
| DELETE DRIVER
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    driverController.deleteDriver
);

export default router;