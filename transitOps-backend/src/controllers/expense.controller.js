import expenseService from '../services/expense.service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

class ExpenseController {
   createExpense = asyncHandler(async (req, res) => {
      const expense = await expenseService.createExpense(req.body);

      return res.status(201).json(
         new ApiResponse(
            201,
            "Expense created successfully.",
            expense
         )
      );
   });

   getExpenseId = asyncHandler(async (req, res) => {
      const expense = await expenseService.findExpense(req.params.id);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Expense retrieved successfully.",
            expense
         )
      );
   });

   getAllExpenses = asyncHandler(async (req, res) => {
      const expenses = await expenseService.getAllExpenses(req.query);

      return res.status(200).json(
         new ApiResponse(
            200, 
            "Expenses retrieved successfully.",
            expenses,
         )
      );
   });

   updateExpense = asyncHandler(async (req, res) => {
      const expense = await expenseService.updateExpense(
         req.params.id,
         req.body,
      );
      return res.status(200).json(
         new ApiResponse(
            200,
            "Expense updated successfully.",
            expense
         )
      );
   });


   deleteExpense = asyncHandler(async (req, res) => {
      await expenseService.deleteExpense(req.params.id);

      return res.status(200).json(
         new ApiResponse(
            200,
            "Expense deleted successfully.",
            null
         )
      );
   });

}

export default new ExpenseController();