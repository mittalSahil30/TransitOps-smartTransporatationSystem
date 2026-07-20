import { body, param, query } from "express-validator";
import {
   MAINTENANCE_STATUS,
   MAINTENANCE_TYPES,
   MAINTENANCE_SORT_FIELDS
} from "../utils/constants.js";
import validator from "../middleware/validators.js";

export const maintenanceIdValidator = [
   param("id")
      .isInt({ min: 1 })
      .withMessage("Valid maintenance ID is required."),
   validator
];

export const createMaintenanceValidator = [
   body("maintenanceNumber")
      .trim()
      .notEmpty()
      .withMessage("Maintenance number is required.")
      .isLength({ max: 30 })
      .withMessage("Maintenance number cannot exceed 30 characters."),

   body("vehicleId")
      .isInt({ min: 1 })
      .withMessage("Valid vehicle ID is required."),

   body("maintenanceType")
      .isIn(Object.values(MAINTENANCE_TYPES))
      .withMessage("Invalid maintenance type."),

   body("serviceCenter")
      .trim()
      .notEmpty()
      .withMessage("Service center is required.")
      .isLength({ max: 150 })
      .withMessage("Service center cannot exceed 150 characters."),

   body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

   body("scheduledDate")
      .isISO8601()
      .withMessage("Valid scheduled date is required."),

   body("odometerReading")
      .isFloat({ min: 0 })
      .withMessage("Odometer reading must be greater than or equal to zero."),

   body("cost")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Cost cannot be negative."),

   body("remarks")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Remarks cannot exceed 1000 characters."),

   validator
];

export const completeMaintenanceValidator = [
   param("id")
      .isInt({ min: 1 })
      .withMessage("Valid maintenance ID is required."),

   body("completionDate")
      .optional()
      .isISO8601()
      .withMessage("Completion date must be a valid date."),

   body("cost")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Cost cannot be negative."),

   body("remarks")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Remarks cannot exceed 1000 characters."),

   validator
];

export const cancelMaintenanceValidator = [
   param("id")
      .isInt({ min: 1 })
      .withMessage("Valid maintenance ID is required."),

   body("remarks")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Remarks cannot exceed 1000 characters."),

   validator
];

export const getMaintenanceValidator = [
   query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be greater than zero."),

   query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100."),

   query("search")
      .optional()
      .trim(),

   query("status")
      .optional()
      .isIn(Object.values(MAINTENANCE_STATUS))
      .withMessage("Invalid maintenance status."),

   query("maintenanceType")
      .optional()
      .isIn(Object.values(MAINTENANCE_TYPES))
      .withMessage("Invalid maintenance type."),

   query("vehicleId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Vehicle ID must be a positive integer."),

   query("sortBy")
      .optional()
      .isIn(MAINTENANCE_SORT_FIELDS)
      .withMessage("Invalid sort field."),

   query("order")
      .optional()
      .isIn(["ASC", "DESC", "asc", "desc"])
      .withMessage("Order must be ASC or DESC."),

   validator
];