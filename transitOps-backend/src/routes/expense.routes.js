import express from "express";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";
import {
   createExpenseValidator,
   updateExpenseValidator,
} from "../validators/expense.validator.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("Admin", "Fleet Manager", "Dispatcher"), expenseController.getAllExpenses);

router.get("/:id", authorize("Admin", "Fleet Manager", "Dispatcher"), expenseController.getExpenseId);

router.post("/", authorize("Admin", "Fleet Manager"),
   createExpenseValidator,
   expenseController.createExpense
);

router.put("/:id", authorize("Admin", "Fleet Manager"),
   updateExpenseValidator,
   expenseController.updateExpense
);

router.delete("/:id", authorize("Admin"), expenseController.deleteExpense);

export default router;
