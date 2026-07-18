import asyncHandler from "../middleware/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import HTTP_STATUS from "../utils/httpStatus.js";

import vehicleService from "../services/vehicle.service.js";

class VehicleController {

   /*
   |--------------------------------------------------------------------------
   | CREATE VEHICLE
   |--------------------------------------------------------------------------
   */

   createVehicle = asyncHandler(async (req, res) => {

      const vehicle = await vehicleService.createVehicle(req.body);

      return res.status(HTTP_STATUS.CREATED).json(

         new ApiResponse(

            HTTP_STATUS.CREATED,

            "Vehicle created successfully.",

            vehicle

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | UPDATE VEHICLE
   |--------------------------------------------------------------------------
   */

   updateVehicle = asyncHandler(async (req, res) => {

      const vehicle = await vehicleService.updateVehicle(

         req.params.id,

         req.body

      );

      return res.status(HTTP_STATUS.OK).json(

         new ApiResponse(

            HTTP_STATUS.OK,

            "Vehicle updated successfully.",

            vehicle

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | GET VEHICLE BY ID
   |--------------------------------------------------------------------------
   */

   getVehicleById = asyncHandler(async (req, res) => {

      const vehicle = await vehicleService.getVehicleById(

         req.params.id

      );

      return res.status(HTTP_STATUS.OK).json(

         new ApiResponse(

            HTTP_STATUS.OK,

            "Vehicle fetched successfully.",

            vehicle

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | GET ALL VEHICLES
   |--------------------------------------------------------------------------
   */

   getAllVehicles = asyncHandler(async (req, res) => {

      const result = await vehicleService.getAllVehicles(

         req.query

      );

      return res.status(HTTP_STATUS.OK).json(

         new ApiResponse(

            HTTP_STATUS.OK,

            "Vehicles fetched successfully.",

            result

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | GET AVAILABLE VEHICLES
   |--------------------------------------------------------------------------
   */

   getAvailableVehicles = asyncHandler(async (req, res) => {

      const vehicles = await vehicleService.getAvailableVehicles();

      return res.status(HTTP_STATUS.OK).json(

         new ApiResponse(

            HTTP_STATUS.OK,

            "Available vehicles fetched successfully.",

            vehicles

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | DELETE VEHICLE
   |--------------------------------------------------------------------------
   */

   deleteVehicle = asyncHandler(async (req, res) => {

      const result = await vehicleService.deleteVehicle(

         req.params.id

      );

      return res.status(HTTP_STATUS.OK).json(

         new ApiResponse(

            HTTP_STATUS.OK,

            result.message,

            null

         )

      );

   });

}

export default new VehicleController();