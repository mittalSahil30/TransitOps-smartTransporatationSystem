import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

import { EXPENSE_TYPES_VALUES, PAYMENT_METHOD_VALUES } from '../utils/constants.js';

const Expense = sequelize.define(
   "Expense",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      vehicleId:{
         type: DataTypes.INTEGER,
         allowNull: false,
         field: "vehicle_id",
      }, 
      tripId: {
         type: DataTypes.INTEGER,
         allowNull: true,
         field: "trip_id",
      }, 
      expenseType: {
         type: DataTypes.ENUM(...EXPENSE_TYPES_VALUES),
         allowNull: false,
         field: "expense_type",
      },

      amount: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         validate: {
            isDecimal: {
               msg: "Amount must be a decimal number.",
            },
         },
      },
      expenseDate: {
         type: DataTypes.DATEONLY,
         allowNull: false,
         field: "expense_date",
         validate: {
            isDate: {
               msg: "Expense date must be a valid date.",
            },
            isBeforeToday(value) {
               if (new Date(value) > new Date()) {
                  throw new Error("Expense date cannot be in the future.");
               }
            },
         },
      },

      paymentMethod: {
         type: DataTypes.ENUM(...PAYMENT_METHOD_VALUES),
         allowNull: false,
         field: "payment_method",
      },

      description: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },

   }, 
   {
      tableName: "expenses",
      freezeTableName: true,
      timestamps: true,
      indexes: [
         {
            unique: true,
            fields: [
               "vehicle_id",
            ]
         }, 
         {
            fields: [
               "expense_date"
            ]
         },
         {
            fields: [
               "payment_method"
            ]
         }, 
         {
            fields: [
               "expense_type"
            ],

         },
         
      ]
   }

)


export default Expense;

