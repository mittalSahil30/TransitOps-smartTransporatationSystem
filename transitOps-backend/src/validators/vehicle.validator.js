import { body } from "express-validator";

import { VEHICLE_TYPES } from "../utils/constants.js";

export const createVehicleValidator = [

   body("registrationNumber")
      .trim()
      .notEmpty()
      .withMessage("Registration Number is required."),

   body("vehicleName")
      .trim()
      .notEmpty()
      .withMessage("Vehicle Name is required."),

   body("model")
      .trim()
      .notEmpty()
      .withMessage("Vehicle Model is required."),

   body("vehicleType")
      .isIn(VEHICLE_TYPES)
      .withMessage("Invalid Vehicle Type."),

   body("maxLoadCapacity")
      .isFloat({ min: 1 })
      .withMessage("Maximum Load Capacity must be greater than 0."),

   body("odometer")
      .isFloat({ min: 0 })
      .withMessage("Odometer cannot be negative."),

   body("acquisitionCost")
      .isFloat({ min: 0 })
      .withMessage("Acquisition Cost cannot be negative."),

   body("region")
      .trim()
      .notEmpty()
      .withMessage("Region is required.")

];

export const updateVehicleValidator = [

   body("registrationNumber")
      .optional()
      .trim(),

   body("vehicleName")
      .optional()
      .trim(),

   body("model")
      .optional()
      .trim(),

   body("vehicleType")
      .optional()
      .isIn(VEHICLE_TYPES),

   body("maxLoadCapacity")
      .optional()
      .isFloat({ min: 1 }),

   body("odometer")
      .optional()
      .isFloat({ min: 0 }),

   body("acquisitionCost")
      .optional()
      .isFloat({ min: 0 }),

   body("region")
      .optional()
      .trim()

];