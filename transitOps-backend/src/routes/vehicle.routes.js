import express from "express";

import vehicleController from "../controllers/vehicle.controller.js";

import authenticate from "../middleware/auth.js";

import authorize from "../middleware/role.js";

import validator from "../middleware/validator.js";

import {

   createVehicleValidator,

   updateVehicleValidator

} from "../validators/vehicle.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL VEHICLES
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticate,
    vehicleController.getAllVehicles
);

/*
|--------------------------------------------------------------------------
| AVAILABLE VEHICLES
|--------------------------------------------------------------------------
*/

router.get(
    "/available",
    authenticate,
    vehicleController.getAvailableVehicles
);

/*
|--------------------------------------------------------------------------
| GET VEHICLE BY ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    authenticate,
    vehicleController.getVehicleById
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(

   "/",

   authenticate,

   authorize(

      "Admin",

      "Fleet Manager"

   ),

   createVehicleValidator,

   validator,

   vehicleController.createVehicle

);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put(

   "/:id",

   authenticate,

   authorize(

      "Admin",

      "Fleet Manager"

   ),

   updateVehicleValidator,

   validator,

   vehicleController.updateVehicle

);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(

   "/:id",

   authenticate,

   authorize("Admin"),

   vehicleController.deleteVehicle

);

export default router;