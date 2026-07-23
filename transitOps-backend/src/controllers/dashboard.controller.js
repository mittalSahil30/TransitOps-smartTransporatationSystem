import dashboardService from "../services/dashboard.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class DashboardController {

   getOverview = asyncHandler(async (req, res) => {

      const overview =
         await dashboardService.getOverview();

      return res.status(200).json(
         new ApiResponse(
            200,
            "Dashboard overview fetched successfully.",
            overview
         )
      );

   });

   getAnalytics = asyncHandler(async (req, res) => {

      const analytics =
         await dashboardService.getAnalytics();

      return res.status(200).json(
         new ApiResponse(
            200,
            "Dashboard analytics fetched successfully.",
            analytics
         )
      );

   });

   getRecent = asyncHandler(async (req, res) => {

      const recent =
         await dashboardService.getRecent();

      return res.status(200).json(

         new ApiResponse(

            200,

            "Recent dashboard data fetched successfully.",

            recent

         )

      );

   });

}

export default new DashboardController();