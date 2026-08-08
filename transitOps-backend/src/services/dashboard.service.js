import { Op, fn, col, literal } from "sequelize";

import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Fuel from "../models/Fuel.js";
import Maintenance from "../models/Maintaince.js";
import Expense from "../models/Expense.js";

import {
   VEHICLE_STATUS,
   DRIVER_STATUS,
   TRIP_STATUS,
   MAINTENANCE_STATUS
} from "../utils/constants.js";

class DashboardService {

   async getOverview() {

      const [
         totalVehicles,
         activeVehicles,

         totalDrivers,
         availableDrivers,

         totalTrips,
         activeTrips,

         totalFuelLogs,
         totalFuelCost,

         pendingMaintenance,
         inProgressMaintenance,



      ] = await Promise.all([

         /*
          * Vehicle Statistics
          */
         Vehicle.count(),

         Vehicle.count({
            where: {
               status: VEHICLE_STATUS.AVAILABLE
            }
         }),

         /*
          * Driver Statistics
          */
         Driver.count(),

         Driver.count({
            where: {
               status: DRIVER_STATUS.AVAILABLE
            }
         }),

         /*
          * Trip Statistics
          */
         Trip.count(),

         Trip.count({
            where: {
               status: TRIP_STATUS.DISPATCHED
            }
         }),

         /*
          * Fuel Statistics
          */
         Fuel.count(),

         Fuel.sum("totalCost"),

         /*
          * Maintenance Statistics
          */
         Maintenance.count({
            where: {
               status: MAINTENANCE_STATUS.SCHEDULED
            }
         }),

         Maintenance.count({
            where: {
               status: MAINTENANCE_STATUS.IN_PROGRESS
            }
         })

      ]);

      return {

         vehicles: {
            total: totalVehicles,
            active: activeVehicles
         },

         drivers: {
            total: totalDrivers,
            available: availableDrivers
         },

         trips: {
            total: totalTrips,
            active: activeTrips
         },

         fuel: {
            logs: totalFuelLogs,
            totalCost: Number(totalFuelCost) || 0
         },

         maintenance: {
            pending: pendingMaintenance,
            inProgress: inProgressMaintenance
         }

      };

   }

   async getAnalytics() {

      /*
      |--------------------------------------------------------------------------
      | Last 12 Months Date Range
      |--------------------------------------------------------------------------
      */

      const today = new Date();

      const last12Months = new Date();

      last12Months.setMonth(today.getMonth() - 11);

      last12Months.setDate(1);

      /*
      |--------------------------------------------------------------------------
      | Monthly Trips
      |--------------------------------------------------------------------------
      */

      const [

         monthlyTrips,

         monthlyFuelCost

      ] = await Promise.all([

         Trip.findAll({

            attributes: [

               [
                  fn("YEAR", col("departure_time")),
                  "year"
               ],

               [
                  fn("MONTH", col("departure_time")),
                  "month"
               ],

               [
                  fn("COUNT", col("id")),
                  "count"
               ]

            ],

            where: {

               departureTime: {

                  [Op.gte]: last12Months

               }

            },

            group: [

               literal("YEAR(departure_time)"),

               literal("MONTH(departure_time)")

            ],

            order: [

               [
                  literal("YEAR(departure_time)"),
                  "ASC"
               ],

               [
                  literal("MONTH(departure_time)"),
                  "ASC"
               ]

            ],

            raw: true

         }),

         Fuel.findAll({

            attributes: [

               [
                  fn("YEAR", col("filledAt")),
                  "year"
               ],

               [
                  fn("MONTH", col("filledAt")),
                  "month"
               ],

               [
                  fn("SUM", col("totalCost")),
                  "amount"
               ]

            ],

            where: {

               filledAt: {

                  [Op.gte]: last12Months

               }

            },

            group: [

               literal("YEAR(filledAt)"),

               literal("MONTH(filledAt)")

            ],

            order: [

               [
                  literal("YEAR(filledAt)"),
                  "ASC"
               ],

               [
                  literal("MONTH(filledAt)"),
                  "ASC"
               ]

            ],

            raw: true

         })

      ]);

      /*
|--------------------------------------------------------------------------
| Status Analytics
|--------------------------------------------------------------------------
*/

      const [

         draftTrips,
         dispatchedTrips,
         completedTrips,
         cancelledTrips,

         scheduledMaintenance,
         inProgressMaintenance,
         completedMaintenance,
         cancelledMaintenance

      ] = await Promise.all([

         /*
         |--------------------------------------------------------------------------
         | Trip Status
         |--------------------------------------------------------------------------
         */

         Trip.count({

            where: {

               status: TRIP_STATUS.DRAFT

            }

         }),

         Trip.count({

            where: {

               status: TRIP_STATUS.DISPATCHED

            }

         }),

         Trip.count({

            where: {

               status: TRIP_STATUS.COMPLETED

            }

         }),

         Trip.count({

            where: {

               status: TRIP_STATUS.CANCELLED

            }

         }),

         /*
         |--------------------------------------------------------------------------
         | Maintenance Status
         |--------------------------------------------------------------------------
         */

         Maintenance.count({

            where: {

               status: MAINTENANCE_STATUS.SCHEDULED

            }

         }),

         Maintenance.count({

            where: {

               status: MAINTENANCE_STATUS.IN_PROGRESS

            }

         }),

         Maintenance.count({

            where: {

               status: MAINTENANCE_STATUS.COMPLETED

            }

         }),

         Maintenance.count({

            where: {

               status: MAINTENANCE_STATUS.CANCELLED

            }

         })

      ]);


      /*
      |--------------------------------------------------------------------------
      | Month Labels
      |--------------------------------------------------------------------------
      */

      const monthNames = [

         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec"

      ];

      /*
      |--------------------------------------------------------------------------
      | Format Monthly Trips
      |--------------------------------------------------------------------------
      */

      const formattedTrips = [];

      for (let i = 11; i >= 0; i--) {

         const date = new Date();

         date.setMonth(today.getMonth() - i);

         const year = date.getFullYear();

         const month = date.getMonth() + 1;

         const record = monthlyTrips.find(item =>

            Number(item.year) === year &&

            Number(item.month) === month

         );

         formattedTrips.push({

            month: monthNames[month - 1],

            year,

            count: record
               ? Number(record.count)
               : 0

         });

      }

      /*
|--------------------------------------------------------------------------
| Format Monthly Fuel Cost
|--------------------------------------------------------------------------
*/

      const formattedFuelCost = [];

      for (let i = 11; i >= 0; i--) {

         const date = new Date();

         date.setMonth(today.getMonth() - i);

         const year = date.getFullYear();

         const month = date.getMonth() + 1;

         const record = monthlyFuelCost.find(item =>

            Number(item.year) === year &&

            Number(item.month) === month

         );

         formattedFuelCost.push({

            month: monthNames[month - 1],

            year,

            amount: record
               ? Number(record.amount)
               : 0

         });

      }

      /*
|--------------------------------------------------------------------------
| Trip Status
|--------------------------------------------------------------------------
*/

      const tripStatus = {

         draft: draftTrips,

         dispatched: dispatchedTrips,

         completed: completedTrips,

         cancelled: cancelledTrips

      };

      /*
      |--------------------------------------------------------------------------
      | Maintenance Status
      |--------------------------------------------------------------------------
      */

      const maintenanceStatus = {

         scheduled: scheduledMaintenance,

         inProgress: inProgressMaintenance,

         completed: completedMaintenance,

         cancelled: cancelledMaintenance

      };
      /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

      return {

         monthlyTrips: formattedTrips,

         monthlyFuelCost: formattedFuelCost,

         tripStatus,

         maintenanceStatus

      };

   }

   async getRecent() {
      const [

         recentTrips,

         recentFuelLogs,

         recentMaintenance

      ] = await Promise.all([

         Trip.findAll({

            limit: 5,

            order: [["createdAt", "DESC"]],

            include: [

               {

                  model: Vehicle,

                  as: "vehicle",

                  attributes: [

                     "registrationNumber"

                  ]

               },

               {

                  model: Driver,
                  
                  as: "driver",

                  attributes: [

                     "firstName",

                     "lastName"

                  ]

               }

            ]

         }),

         Fuel.findAll({

            limit: 5,

            order: [["createdAt", "DESC"]],

            include: [

               {

                  model: Vehicle,

                  as: "vehicle",

                  attributes: [

                     "registrationNumber"

                  ]

               }

            ]

         }),

         Maintenance.findAll({

            limit: 5,

            order: [["createdAt", "DESC"]],

            include: [

               {

                  model: Vehicle,

                  as: "vehicle",

                  attributes: [

                     "registrationNumber"

                  ]

               }

            ]

         })

      ]);


      return {

         recentTrips,

         recentFuelLogs,

         recentMaintenance

      };
   }


   async getExpenseSummary(query = {}) {

      const {
         startDate,
         endDate
      } = query;

      const where = {

         deletedAt: null

      };

      if (startDate || endDate) {

         where.expenseDate = {};

         if (startDate) {

            where.expenseDate[Op.gte] = startDate;

         }

         if (endDate) {

            where.expenseDate[Op.lte] = endDate;

         }

      }

      const totalExpenses = await Expense.sum(
         "amount",
         {
            where
         }
      );

      const expenseCount = await Expense.count({

         where

      });

      return {

         totalExpenses:
            Number(totalExpenses || 0),

         expenseCount

      };

   }

   async getMonthlyExpenses(query = {}) {

      const {
         startDate,
         endDate
      } = query;

      const where = {

         deletedAt: null

      };

      if (startDate || endDate) {

         where.expenseDate = {};

         if (startDate) {

            where.expenseDate[Op.gte] =
               startDate;

         }

         if (endDate) {

            where.expenseDate[Op.lte] =
               endDate;

         }

      }

      const monthlyExpenses =
         await Expense.findAll({

            attributes: [

               [
                  fn(
                     "YEAR",
                     col("expenseDate")
                  ),
                  "year"
               ],

               [
                  fn(
                     "MONTH",
                     col("expenseDate")
                  ),
                  "month"
               ],

               [
                  fn(
                     "SUM",
                     col("amount")
                  ),
                  "amount"
               ]

            ],

            where,

            group: [

               literal(
                  "YEAR(expense_date)"
               ),

               literal(
                  "MONTH(expense_date)"
               )

            ],

            order: [

               [
                  literal(
                     "YEAR(expense_date)"
                  ),
                  "ASC"
               ],

               [
                  literal(
                     "MONTH(expense_date)"
                  ),
                  "ASC"
               ]

            ],

            raw: true

         });

      return monthlyExpenses.map(
         expense => ({

            year:
               Number(expense.year),

            month:
               Number(expense.month),

            amount:
               Number(expense.amount || 0)

         })
      );

   }

   async getExpensesByCategory(query = {}) {

      const {
         startDate,
         endDate
      } = query;

      const where = {

         deletedAt: null

      };

      if (startDate || endDate) {

         where.expenseDate = {};

         if (startDate) {

            where.expenseDate[Op.gte] =
               startDate;

         }

         if (endDate) {

            where.expenseDate[Op.lte] =
               endDate;

         }

      }

      const categoryExpenses =
         await Expense.findAll({

            attributes: [

               "expenseType",

               [
                  fn(
                     "SUM",
                     col("amount")
                  ),
                  "amount"
               ],

               [
                  fn(
                     "COUNT",
                     col("id")
                  ),
                  "count"
               ]

            ],

            where,

            group: [

               "expenseType"

            ],

            order: [

               [
                  literal("amount"),
                  "DESC"
               ]

            ],

            raw: true

         });

      return categoryExpenses.map(
         expense => ({

            expenseType:
               expense.expenseType,

            amount:
               Number(
                  expense.amount || 0
               ),

            count:
               Number(
                  expense.count || 0
               )

         })
      );

   }

}

export default new DashboardService();