import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';

import { EXPENSE_SORT_FIELDS } from '../utils/constants.js';

const {
   sequelize,
   Vehicle,
   Driver,
   Trip,
   Expense,
} = db;


class ExpenseService {
   async findExpense(id, transaction = null) {
      const expense = await Expense.findOne({
         where: { id, deletedAt: null },
         include: [{
            model: Vehicle,
            as: "vehicle",
         }, 
         {
            model: Trip,
            as: "trip",
         }
      ],
      transaction
      });


      if(!expense) {
         throw new ApiError(404, "Expense not found");
      }

      return expense;
   }

   async checkExpenseNumber(expenseNumber, excludeId = null) {
      const where = {
         expenseNumber,
         deletedAt: null
      };

      if(excludeId) {
         where.id = { [Op.ne]: excludeId };
      }

      const Expense = await Expense.findOne({
         where,
      });

      if(Expense) {
         throw new ApiError(400, "Expense number already exists");
      }
   }

   async validateVehicle(vehicleId, transaction = null) {
      const vehicle = await Vehicle.findOne({
         where: { id: vehicleId, isDeleted: false },
         transaction

      });

      if(!vehicle) {
         throw new ApiError(404, "Vehicle not found");
      }

      return vehicle;
   }

   async validateTrip(tripId, transaction = null) {
      if(!tripId) return null;
      const trip = await Trip.findOne({
         where: {
            id: tripId,
            isDeleted: false,
         },
         transaction
      });

      if(!trip){
         throw new ApiError(404, "Trip not found");

      }

      return trip;
   }

   async createExpense(data) {
      await this.checkExpenseNumber(data.expenseNumber);
      const transaction = await sequelize.transaction();

      try {
         const vehicle = await this.validateVehicle(data.vehicleId, 
            transaction
         );

         let trip = null;

         if(data.tripId) {
            trip = await this.validateTrip(data.tripId, transaction);
         }

         if(
            new Date(data.expenseDate) > new Date() 
         ){
            throw new ApiError(400, "Expense date cannot be in the future");
         }

         const expense = await Expense.create({
            expenseNumber: data.expenseNumber,
            vehicleId: vehicle.id,
            tripId: trip?.id?? null,
            expenseType: data.expenseType,
            amount: data.amount,
            paymentMethod: data.paymentMethod,

            expenseDate: data.expenseDate,

            description: data.description,


         }, {transaction});

         await transaction.commit();
         return await this.findExpense(expense.id);
      }
      catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   async getExpenseById(id) {
      const expense = await Expense.findOne({
         where: {
            id,
            deletedAt: null,
         },
         include: [{
            model: Vehicle,
            as: "vehicle",
         }, {
            model: Trip,
            as: "trip",
         }]
      });

      if(!expense) {
         throw new ApiError(404, "Expense not found");
      }

      return expense.toJSON();
   }

   async getAllExpenses(query = {}) {
      const {
         page = 1,
         limit = 10,
         search,
         vehicleId,
         tripId,
         expenseType,
         paymentMethod,
         startDate,
         endDate,
         sortBy = 'createdAt',
         order = 'DESC',
      } = query;

      const where = {
         deletedAt: null,
      };

      if(search) {
         where[Op.or] = [
            {
               expenseNumber: {
                  [Op.like]: `%${search}%`
               }
            },

            {
               description: {
                  [Op.like]: `%${search}%`
               }
            }
         ];
      }

      if(vehicleId) {
         where.vehicleId = vehicleId;
      }

      if(tripId) {
         where.tripId = tripId;
      }

      if(expenseType) {
         where.expenseType = expenseType;
      }

      if(paymentMethod) {
         where.paymentMethod = paymentMethod;
      }

      if (startDate || endDate) {

         where.expenseDate = {};

         if (startDate) {

            where.expenseDate[Op.gte] = startDate;

         }

         if (endDate) {

            where.expenseDate[Op.lte] = endDate;

         }

      }

      const pageNumber = Number(page);
      const pageLimit = Number(limit);

      const offset = (pageNumber - 1)*pageLimit;

      const sortField = EXPENSE_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';

      const sortOrder = order.toUpperCase() === "ASC"

         ? "ASC"

         : "DESC";

      const { rows, count } = await Expense.findAndCountAll({
         where,
         include: [{
            model: Vehicle,
            as: "vehicle",

         }, {
            model: Trip,
            as: "trip",
         }

         ],
         limit: pageLimit,

         offset,
         order: [[sortField, sortOrder]]
      });

      return {
         expenses: rows.map(expense => expense.toJSON()),
         pagination: {
            page: pageNumber,
            limit: pageLimit,
            total: count,
            totalPages: Math.ceil(count/pageLimit),
         }
      };
   }

   async updateExpense(id, data) {
      const transaction = await sequelize.transaction();

      try {
         const expense = await this.findExpense(id, transaction);

         if(data.expenseNumber && data.expenseNumber !== expense.expenseNumber) {
            await this.checkExpenseNumber(data.expenseNumber, expense.id);
         }
         
         let vehicleId = expense.vehicleId;
         if(data.vehicleId) {
            const vehicle = await this.validateVehicle(data.vehicleId, transaction);
            vehicleId = vehicle.id;
         }

         let tripId = null;

         if(data.tripId) {
            const trip = await this.validateTrip(data.tripId, transaction);
            tripId = trip.id;
         }

         if(data.expenseDate && new Date(data.expenseDate) > new Date()) {
            throw new ApiError(400, "Expense date cannot be in the future");
         }

         await expense.update({
            expenseNumber: data.expenseNumber ?? expense.expenseNumber,
            vehicleId, 
            tripId,
            expenseType: data.expenseType ?? expense.expenseType,
            amount: data.amount ?? expense.amount,
            paymentMethod: data.paymentMethod ?? expense.paymentMethod,
            expenseDate: data.expenseDate ?? expense.expenseDate,
            description: data.description ?? expense.description,
         }, { transaction });

         await transaction.commit();
         return await this.getExpenseById(expense.id);
      }
      catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   async deleteExpense(id) {

      const expense = await this.findExpense(id);

      await expense.destroy();

      return {

         message: "Expense deleted successfully."

      };

   }
}

export default new ExpenseService();