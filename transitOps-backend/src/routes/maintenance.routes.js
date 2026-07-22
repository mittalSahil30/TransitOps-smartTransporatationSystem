import express from "express";
import maintenanceController from "../controllers/maintenance.controller.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/role.js";
import {
   createMaintenanceValidator,
   completeMaintenanceValidator,
   cancelMaintenanceValidator,
   maintenanceIdValidator,
   getMaintenanceValidator
} from "../validators/maintenance.validator.js";

const router = express.Router();

router.use(authenticate);

router.get(
   "/",
   authorize("Admin", "Fleet Manager", "Dispatcher"),
   getMaintenanceValidator,
   maintenanceController.getAllMaintenance
);

router.get(
   "/:id",
   authorize("Admin", "Fleet Manager", "Dispatcher"),
   maintenanceIdValidator,
   maintenanceController.getMaintenanceById
);

router.post(
   "/",
   authorize("Admin", "Fleet Manager"),
   createMaintenanceValidator,
   maintenanceController.createMaintenance
);

router.patch(
   "/:id/start",
   authorize("Admin", "Fleet Manager"),
   maintenanceIdValidator,
   maintenanceController.startMaintenance
);

router.patch(
   "/:id/complete",
   authorize("Admin", "Fleet Manager"),
   completeMaintenanceValidator,
   maintenanceController.completeMaintenance
);

router.patch(
   "/:id/cancel",
   authorize("Admin", "Fleet Manager"),
   cancelMaintenanceValidator,
   maintenanceController.cancelMaintenance
);

router.delete(
   "/:id",
   authorize("Admin"),
   maintenanceIdValidator,
   maintenanceController.deleteMaintenance
);

export default router;