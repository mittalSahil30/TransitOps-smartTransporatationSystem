import maintenanceService from "../services/maintenance.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class MaintenanceController {

   createMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.createMaintenance(req.body);

      return ApiResponse.created(
         res,
         maintenance,
         "Maintenance created successfully."
      );
   });

   startMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.startMaintenance(
         req.params.id
      );

      return ApiResponse.success(
         res,
         maintenance,
         "Maintenance started successfully."
      );
   });

   completeMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.completeMaintenance(
         req.params.id,
         req.body
      );

      return ApiResponse.success(
         res,
         maintenance,
         "Maintenance completed successfully."
      );
   });

   cancelMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.cancelMaintenance(
         req.params.id,
         req.body.remarks
      );

      return ApiResponse.success(
         res,
         maintenance,
         "Maintenance cancelled successfully."
      );
   });

   getMaintenanceById = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.getMaintenanceById(
         req.params.id
      );

      return ApiResponse.success(
         res,
         maintenance,
         "Maintenance retrieved successfully."
      );
   });

   getAllMaintenance = asyncHandler(async (req, res) => {
      const maintenance = await maintenanceService.getAllMaintenance(
         req.query
      );

      return ApiResponse.success(
         res,
         maintenance,
         "Maintenance records retrieved successfully."
      );
   });

   deleteMaintenance = asyncHandler(async (req, res) => {
      const result = await maintenanceService.deleteMaintenance(
         req.params.id
      );

      return ApiResponse.success(
         res,
         result,
         result.message
      );
   });

}

export default new MaintenanceController();