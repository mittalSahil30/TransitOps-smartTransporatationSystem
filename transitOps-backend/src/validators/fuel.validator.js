import { body, param, query } from "express-validator";
import validator from "../middleware/validators.js";
import {
   FUEL_TYPE_VALUES,
   PAYMENT_METHOD_VALUES,
   FUEL_SORT_FIELDS
} from "../utils/constants.js";

/* ==========================================
   Fuel ID Validator
========================================== */

export const fuelIdValidator = [
   param("id")
      .isInt({ min: 1 })
      .withMessage("Valid fuel log ID is required."),

   validator
];

/* ==========================================
   Create Fuel Validator
========================================== */

export const createFuelValidator = [

   body("vehicleId")
      .notEmpty()
      .withMessage("Vehicle is required.")
      .isInt({ min: 1 })
      .withMessage("Vehicle ID must be a positive integer."),

   body("tripId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Trip ID must be a positive integer."),

   body("receiptNumber")
      .trim()
      .notEmpty()
      .withMessage("Receipt number is required.")
      .isLength({ max: 50 })
      .withMessage("Receipt number cannot exceed 50 characters."),

   body("fuelType")
      .notEmpty()
      .withMessage("Fuel type is required.")
      .isIn(FUEL_TYPE_VALUES)
      .withMessage("Invalid fuel type."),

   body("quantity")
      .notEmpty()
      .withMessage("Quantity is required.")
      .isFloat({ gt: 0 })
      .withMessage("Quantity must be greater than 0."),

   body("pricePerUnit")
      .notEmpty()
      .withMessage("Price per unit is required.")
      .isFloat({ gt: 0 })
      .withMessage("Price per unit must be greater than 0."),

   body("totalCost")
      .notEmpty()
      .withMessage("Total cost is required.")
      .isFloat({ gt: 0 })
      .withMessage("Total cost must be greater than 0."),

   body("odometerReading")
      .notEmpty()
      .withMessage("Odometer reading is required.")
      .isInt({ min: 0 })
      .withMessage("Odometer reading must be a positive number."),

   body("stationName")
      .trim()
      .notEmpty()
      .withMessage("Fuel station name is required.")
      .isLength({ max: 100 })
      .withMessage("Fuel station name cannot exceed 100 characters."),

   body("paymentMethod")
      .notEmpty()
      .withMessage("Payment method is required.")
      .isIn(PAYMENT_METHOD_VALUES)
      .withMessage("Invalid payment method."),

   body("filledAt")
      .optional()
      .isISO8601()
      .withMessage("Invalid filled date."),

   body("remarks")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Remarks cannot exceed 500 characters."),

   validator
];

/* ==========================================
   Get Fuel Logs Validator
========================================== */

export const getFuelValidator = [

   query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be greater than 0."),

   query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100."),

   query("vehicleId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Vehicle ID must be a positive integer."),

   query("tripId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Trip ID must be a positive integer."),

   query("fuelType")
      .optional()
      .isIn(FUEL_TYPE_VALUES)
      .withMessage("Invalid fuel type."),

   query("paymentMethod")
      .optional()
      .isIn(PAYMENT_METHOD_VALUES)
      .withMessage("Invalid payment method."),

   query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search keyword cannot exceed 100 characters."),

   query("sortBy")
      .optional()
      .isIn(FUEL_SORT_FIELDS)
      .withMessage("Invalid sort field."),

   query("order")
      .optional()
      .isIn(["ASC", "DESC", "asc", "desc"])
      .withMessage("Order must be ASC or DESC."),

   validator
];