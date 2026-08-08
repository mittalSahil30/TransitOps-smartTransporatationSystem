import express from "express";
import tripRoutes from "./trip.routes.js";
import authRoutes from "./auth.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import driverRoutes from "./driver.routes.js";
import maintenanceRoutes from "./maintenance.routes.js"
import fuelRoutes from "./fuel.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

import expenseRoutes from "./expense.routes.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(
    "/auth",
    authRoutes
);

/*
|--------------------------------------------------------------------------
| Vehicles
|--------------------------------------------------------------------------
*/

router.use(
    "/vehicles",
    vehicleRoutes
);

/*
|--------------------------------------------------------------------------
| Drivers
|--------------------------------------------------------------------------
*/

router.use(
    "/drivers",
    driverRoutes
);
/*
|--------------------------------------------------------------------------
| Trips
|--------------------------------------------------------------------------
*/

router.use(
    "/trips",
    tripRoutes
);

router.use("/maintenance", maintenanceRoutes);

router.use("/fuel", fuelRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/expenses", expenseRoutes);


export default router;