import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import {
   FUEL_TYPE_VALUES,
   PAYMENT_METHOD_VALUES
} from "../utils/constants.js";

const Fuel = sequelize.define(
   "Fuel",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true
      },

      vehicleId: {
         type: DataTypes.INTEGER,
         allowNull: false
      },

      tripId: {
         type: DataTypes.INTEGER,
         allowNull: true
      },

      receiptNumber: {
         type: DataTypes.STRING(50),
         allowNull: false,
         unique: true
      },

      fuelType: {
         type: DataTypes.ENUM(...FUEL_TYPE_VALUES),
         allowNull: false
      },

      quantity: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false
      },

      pricePerUnit: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false
      },

      totalCost: {
         type: DataTypes.DECIMAL(12, 2),
         allowNull: false
      },

      odometerReading: {
         type: DataTypes.INTEGER,
         allowNull: false
      },

      stationName: {
         type: DataTypes.STRING(100),
         allowNull: false
      },

      paymentMethod: {
         type: DataTypes.ENUM(...PAYMENT_METHOD_VALUES),
         allowNull: false
      },

      filledAt: {
         type: DataTypes.DATE,
         allowNull: false,
         defaultValue: DataTypes.NOW
      },

      remarks: {
         type: DataTypes.TEXT,
         allowNull: true
      }
   },
   {
      tableName: "fuel_logs",
      timestamps: true,
      paranoid: true
   }
);

export default Fuel;
