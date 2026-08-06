import { body } from 'express-validator';
import validator from '../middleware/validator.js';

import {
   EXPENSE_TYPE_VALUES,
   PAYMENT_METHOD_VALUES
} from "../utils/constants.js";

export const createExpenseValidator = [
   body("expenseNumber")
      .trim()
      .notEmpty()
      .withMessage("Expense number is required.")
      .isLength({ max: 20 })
      .withMessage("Expense number must be at most 20 characters."),
   
   body("vehicleId") 
      .notEmpty()
      .withMessage("Vehicle ID is required.")
      .isUUID()
      .withMessage("Invalid vehicle ID."),

   body("tripId")
      .optional({
         nullable: true,
         checkFalsy: true
      })
      .isUUID()
      .withMessage("Invalid trip ID."),
   body("expenseType") 
      .notEmpty()
      .withMessage("Expense type is required.")
      .isIn(
         EXPENSE_TYPE_VALUES
      )
      .withMessage("Invalid expense type."),

   body("amount")
      .notEmpty()
      .withMessage("Amount is required.")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number."),

   body("paymentMethod") 
      .notEmpty()
      .withMessage("Payment method is required.")
      .isIn(
         PAYMENT_METHOD_VALUES
      )
      .withMessage("Invalid payment method."),

   body("expenseDate")
      .notEmpty()
      .withMessage("Expense date is required.")
      .isDate()
      .withMessage("Invalid expense date."),

   body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be at most 200 characters."),

   validator

];


export const updateExpenseValidator = [

   body("expenseNumber")

      .optional()

      .trim()

      .isLength({

         max: 20

      })

      .withMessage("Expense number cannot exceed 20 characters."),

   body("vehicleId")

      .optional()

      .isUUID()

      .withMessage("Invalid vehicle ID."),

   body("tripId")

      .optional({

         nullable: true,

         checkFalsy: true

      })

      .isUUID()

      .withMessage("Invalid trip ID."),

   body("expenseType")

      .optional()

      .isIn(

         EXPENSE_TYPE_VALUES

      )

      .withMessage("Invalid expense type."),

   body("amount")

      .optional()

      .isFloat({

         gt: 0

      })

      .withMessage("Amount must be greater than zero."),

   body("paymentMethod")

      .optional()

      .isIn(

         PAYMENT_METHOD_VALUES

      )

      .withMessage("Invalid payment method."),

   body("expenseDate")

      .optional()

      .isISO8601()

      .withMessage("Invalid expense date."),

   body("description")

      .optional()

      .trim()

      .isLength({

         max: 500

      })

      .withMessage("Description cannot exceed 500 characters."),

   validator

];