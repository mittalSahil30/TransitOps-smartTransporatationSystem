import express from "express";

import tripController from "../controllers/trip.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import validator from "../middleware/validator.js";

import {
    createTripValidator,
    completeTripValidator,
    dispatchTripValidator,
    cancelTripValidator,
} from "../validators/trip.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL TRIPS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager",
        "Dispatcher"
    ),
    tripController.getAllTrips
);

/*
|--------------------------------------------------------------------------
| GET TRIP BY ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager",
        "Dispatcher"
    ),
    tripController.getTripById
);

/*
|--------------------------------------------------------------------------
| CREATE TRIP
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager",
        "Dispatcher"
    ),
    createTripValidator,
    validator,
    tripController.createTrip
);

/*
|--------------------------------------------------------------------------
| DISPATCH TRIP
|--------------------------------------------------------------------------
*/

router.put(
    "/:id/dispatch",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager",
        "Dispatcher"
    ),
    dispatchTripValidator,
    validator,
    tripController.dispatchTrip
);

/*
|--------------------------------------------------------------------------
| COMPLETE TRIP
|--------------------------------------------------------------------------
*/

router.put(
    "/:id/complete",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager",
        "Dispatcher"
    ),
    completeTripValidator,
    validator,
    tripController.completeTrip
);

/*
|--------------------------------------------------------------------------
| CANCEL TRIP
|--------------------------------------------------------------------------
*/

router.put(
    "/:id/cancel",
    authenticate,
    authorize(
        "Admin",
        "Fleet Manager"
    ),
    cancelTripValidator,
    validator,
    tripController.cancelTrip
);

/*
|--------------------------------------------------------------------------
| DELETE TRIP
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    tripController.deleteTrip
);

export default router;