import { body } from "express-validator";
import { DRIVER_STATUS } from "../utils/constants.js";

/*
|--------------------------------------------------------------------------
| Common Validation Rules
|--------------------------------------------------------------------------
*/

const employeeId = body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Employee ID must be between 3 and 30 characters.");

const firstName = body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("First name must be between 2 and 100 characters.");

const lastName = body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Last name must be between 2 and 100 characters.");

const email = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail();

const phone = body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("any")
    .withMessage("Invalid phone number.");

const licenseNumber = body("licenseNumber")
    .trim()
    .notEmpty()
    .withMessage("License number is required.")
    .isLength({ min: 5, max: 50 })
    .withMessage("License number is invalid.");

const licenseExpiry = body("licenseExpiry")
    .notEmpty()
    .withMessage("License expiry date is required.")
    .isISO8601()
    .withMessage("License expiry must be a valid date.");

const joiningDate = body("joiningDate")
    .notEmpty()
    .withMessage("Joining date is required.")
    .isISO8601()
    .withMessage("Joining date must be a valid date.");

const region = body("region")
    .trim()
    .notEmpty()
    .withMessage("Region is required.");

const status = body("status")
    .optional()
    .isIn([
        DRIVER_STATUS.AVAILABLE,
        DRIVER_STATUS.ON_TRIP,
        DRIVER_STATUS.OFF_DUTY,
        DRIVER_STATUS.SUSPENDED,
    ])
    .withMessage("Invalid driver status.");

/*
|--------------------------------------------------------------------------
| Create Driver Validator
|--------------------------------------------------------------------------
*/

export const createDriverValidator = [

    employeeId,

    firstName,

    lastName,

    email,

    phone,

    licenseNumber,

    licenseExpiry,

    joiningDate,

    region,

    status

];

/*
|--------------------------------------------------------------------------
| Update Driver Validator
|--------------------------------------------------------------------------
*/

export const updateDriverValidator = [

    body("employeeId").optional().trim(),

    body("firstName").optional().trim(),

    body("lastName").optional().trim(),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address.")
        .normalizeEmail(),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("any")
        .withMessage("Invalid phone number."),

    body("licenseNumber")
        .optional()
        .trim(),

    body("licenseExpiry")
        .optional()
        .isISO8601()
        .withMessage("Invalid license expiry date."),

    body("joiningDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid joining date."),

    body("region")
        .optional()
        .trim(),

    status

];