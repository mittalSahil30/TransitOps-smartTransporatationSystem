import fuelService from "../services/fuel.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

class FuelController {

   /**
    * Create Fuel Log
    */
   createFuelLog = asyncHandler(async (req, res) => {

      const fuelLog = await fuelService.createFuelLog(req.body);

      return res.status(201).json(
         new ApiResponse(
            201,
            "Fuel log created successfully.",
            fuelLog
         )
      );

   });

   /**
    * Get Fuel Log By ID
    */
   getFuelLogById = asyncHandler(async (req, res) => {

      const fuelLog = await fuelService.getFuelLogById(req.params.id);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Fuel log fetched successfully.",
            fuelLog
         )
      );

   });

   /**
    * Get All Fuel Logs
    */
   getAllFuelLogs = asyncHandler(async (req, res) => {

      const fuelLogs = await fuelService.getAllFuelLogs(req.query);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Fuel logs fetched successfully.",
            fuelLogs
         )
      );

   });

   /**
    * Delete Fuel Log
    */
   deleteFuelLog = asyncHandler(async (req, res) => {

      await fuelService.deleteFuelLog(req.params.id);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Fuel log deleted successfully."
         )
      );

   });

}

export default new FuelController();