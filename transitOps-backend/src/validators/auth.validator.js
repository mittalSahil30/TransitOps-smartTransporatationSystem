import { body } from "express-validator";

/*
|--------------------------------------------------------------------------
| Login Validation
|--------------------------------------------------------------------------
*/

export const loginValidator = [

   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email address."),

   body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
];

/*
|--------------------------------------------------------------------------
| Register Validation
|--------------------------------------------------------------------------
*/

export const registerValidator = [

   body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First Name is required.")
      .isLength({ min: 2, max: 100 }),

   body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last Name is required.")
      .isLength({ min: 2, max: 100 }),

   body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .normalizeEmail(),

   body("password")
      .trim()
      .isLength({
         min: 8
      })
      .withMessage(
         "Password must contain minimum 8 characters."
      ),

   body("roleId")
      .isInt()
      .withMessage("Role is required.")
];