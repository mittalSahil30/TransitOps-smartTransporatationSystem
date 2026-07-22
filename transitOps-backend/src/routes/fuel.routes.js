import express from "express";
import fuelController from "../controllers/fuel.controller.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import {
   createFuelValidator,
   fuelIdValidator,
   getFuelValidator
} from "../validators/fuel.validator.js";

const router = express.Router();

router.use(authenticate);

/**
 * Get All Fuel Logs
 */
router.get(
   "/",
   authorize("Admin", "Fleet Manager", "Dispatcher"),
   getFuelValidator,
   fuelController.getAllFuelLogs
);

/**
 * Get Fuel Log By ID
 */
router.get(
   "/:id",
   authorize("Admin", "Fleet Manager", "Dispatcher"),
   fuelIdValidator,
   fuelController.getFuelLogById
);

/**
 * Create Fuel Log
 */
router.post(
   "/",
   authorize("Admin", "Fleet Manager"),
   createFuelValidator,
   fuelController.createFuelLog
);

/**
 * Delete Fuel Log
 */
router.delete(
   "/:id",
   authorize("Admin"),
   fuelIdValidator,
   fuelController.deleteFuelLog
);

export default router;