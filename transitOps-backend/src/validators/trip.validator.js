import { body } from "express-validator";

/*
|--------------------------------------------------------------------------
| CREATE TRIP VALIDATOR
|--------------------------------------------------------------------------
*/

export const createTripValidator = [

    body("tripNumber")
        .trim()
        .notEmpty()
        .withMessage("Trip number is required.")
        .isLength({ min: 3, max: 30 })
        .withMessage("Trip number must be between 3 and 30 characters."),

    body("vehicleId")
        .notEmpty()
        .withMessage("Vehicle is required.")
        .isInt({ min: 1 })
        .withMessage("Vehicle ID must be a positive integer."),

    body("driverId")
        .notEmpty()
        .withMessage("Driver is required.")
        .isInt({ min: 1 })
        .withMessage("Driver ID must be a positive integer."),

    body("origin")
        .trim()
        .notEmpty()
        .withMessage("Origin is required.")
        .isLength({ max: 150 })
        .withMessage("Origin cannot exceed 150 characters."),

    body("destination")
        .trim()
        .notEmpty()
        .withMessage("Destination is required.")
        .isLength({ max: 150 })
        .withMessage("Destination cannot exceed 150 characters."),

    body("departureTime")
        .notEmpty()
        .withMessage("Departure time is required.")
        .isISO8601()
        .withMessage("Departure time must be a valid date."),

    body("expectedArrival")
        .notEmpty()
        .withMessage("Expected arrival is required.")
        .isISO8601()
        .withMessage("Expected arrival must be a valid date."),

    body("distance")
        .notEmpty()
        .withMessage("Distance is required.")
        .isFloat({ gt: 0 })
        .withMessage("Distance must be greater than zero."),

    body("cargoWeight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Cargo weight cannot be negative."),

    body("startOdometer")
        .notEmpty()
        .withMessage("Start odometer is required.")
        .isFloat({ min: 0 })
        .withMessage("Start odometer must be zero or greater."),

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Remarks cannot exceed 1000 characters.")

];

/*
|--------------------------------------------------------------------------
| COMPLETE TRIP VALIDATOR
|--------------------------------------------------------------------------
*/

export const completeTripValidator = [

    body("actualArrival")
        .notEmpty()
        .withMessage("Actual arrival is required.")
        .isISO8601()
        .withMessage("Actual arrival must be a valid date."),

    body("endOdometer")
        .notEmpty()
        .withMessage("End odometer is required.")
        .isFloat({ min: 0 })
        .withMessage("End odometer must be zero or greater."),

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Remarks cannot exceed 1000 characters.")

];

/*
|--------------------------------------------------------------------------
| DISPATCH TRIP VALIDATOR
|--------------------------------------------------------------------------
*/

export const dispatchTripValidator = [];

/*
|--------------------------------------------------------------------------
| CANCEL TRIP VALIDATOR
|--------------------------------------------------------------------------
*/

export const cancelTripValidator = [

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Remarks cannot exceed 1000 characters.")

];