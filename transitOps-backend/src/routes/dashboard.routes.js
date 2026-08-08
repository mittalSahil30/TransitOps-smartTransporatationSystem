import express from "express";

import dashboardController from "../controllers/dashboard.controller.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";

import {
   overviewValidator,
   analyticsValidator,
   recentValidator
} from "../validators/dashboard.validator.js";

const router = express.Router();

router.use(authenticate);

router.get(
   "/overview",
   authorize(
      "Admin",
      "Fleet Manager",
      "Dispatcher"
   ),
   overviewValidator,
   dashboardController.getOverview
);

router.get(
   "/analytics",
   authorize(
      "Admin",
      "Fleet Manager",
      "Dispatcher"
   ),
   analyticsValidator,
   dashboardController.getAnalytics
);

router.get(

   "/recent",

   authorize(

      "Admin",

      "Fleet Manager",

      "Dispatcher"

   ),

   recentValidator,

   dashboardController.getRecent

);


/*
|--------------------------------------------------------------------------
| EXPENSE SUMMARY
|--------------------------------------------------------------------------
*/

router.get(
   "/expense-summary",
   authenticate,
   authorize(
      "Admin",
      "Fleet Manager",
      "Dispatcher"
   ),
   dashboardController.getExpenseSummary
);

/*
|--------------------------------------------------------------------------
| MONTHLY EXPENSES
|--------------------------------------------------------------------------
*/

router.get(
   "/expense-monthly",
   authenticate,
   authorize(
      "Admin",
      "Fleet Manager",
      "Dispatcher"
   ),
   dashboardController.getMonthlyExpenses
);

/*
|--------------------------------------------------------------------------
| EXPENSES BY CATEGORY
|--------------------------------------------------------------------------
*/

router.get(
   "/expense-categories",
   authenticate,
   authorize(
      "Admin",
      "Fleet Manager",
      "Dispatcher"
   ),
   dashboardController.getExpensesByCategory
);


export default router;