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

   getExpenseSummary = asyncHandler(async (req, res) => {

      const summary =
         await dashboardService.getExpenseSummary(req.query);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Expense summary fetched successfully.",
            summary
         )
      );

   });

   getMonthlyExpenses = asyncHandler(async (req, res) => {

      const monthlyExpenses =
         await dashboardService.getMonthlyExpenses(req.query);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Monthly expenses fetched successfully.",
            monthlyExpenses
         )
      );

   });

   getExpensesByCategory = asyncHandler(async (req, res) => {

      const expensesByCategory =
         await dashboardService.getExpensesByCategory(req.query);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Expenses by category fetched successfully.",
            expensesByCategory
         )
      );

   });

}

export default new DashboardController();