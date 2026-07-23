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
export default router;