import maintenanceService from "../services/maintenance.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class MaintenanceController {

   createMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.createMaintenance(req.body);

      return res.status(201).json(
         new ApiResponse(
            201,
            "Maintenance created successfully.",
            maintenance
         )
      );
   });

   startMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.startMaintenance(
         req.params.id
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            "Maintenance started successfully.",
            maintenance
         )
      );
   });

   completeMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.completeMaintenance(
         req.params.id,
         req.body
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            "Maintenance completed successfully.",
            maintenance
         )
      );
   });

   cancelMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.cancelMaintenance(
         req.params.id,
         req.body.remarks
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            "Maintenance cancelled successfully.",
            maintenance
         )
      );
   });

   getMaintenanceById = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.getMaintenanceById(
         req.params.id
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            "Maintenance retrieved successfully.",
            maintenance
         )
      );
   });

   getAllMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.getAllMaintenance(
         req.query
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            "Maintenance records retrieved successfully.",
            maintenance
         )
      );
   });

   deleteMaintenance = asyncHandler(async (req, res) => {
      const result = await maintenanceService.deleteMaintenance(
         req.params.id
      );

      return res.status(200).json(
         new ApiResponse(
            200,
            result.message,
            result
         )
      );
   });

}

export default new MaintenanceController();