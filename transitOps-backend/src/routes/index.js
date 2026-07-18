import express from "express";
import tripRoutes from "./trip.routes.js";
import authRoutes from "./auth.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import driverRoutes from "./driver.routes.js";

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
export default router;