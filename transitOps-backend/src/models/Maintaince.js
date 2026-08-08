import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

import { MAINTENANCE_STATUS, MAINTENANCE_STATUS_VALUES, MAINTENANCE_TYPES, MAINTENANCE_TYPE_VALUES } from "../utils/constants.js";

const Maintenance = sequelize.define(
   "Maintaince", {
      id : {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      }, 
      maintenanceNumber: {
         type: DataTypes.STRING(30),
         allowNull: false,
         unique: true,
         field: "maintenance_number",
      }, 
      vehicleId: {
         type: DataTypes.INTEGER,
         allowNull: false,
         field: "vehicle_id",
      },
      maintenanceType: {
         type: DataTypes.ENUM(
            ...MAINTENANCE_TYPE_VALUES
         ),
         allowNull: false,

         field: "maintenance_type",
      },
      serviceCenter: {
         type: DataTypes.STRING(150),
         allowNull: false,

         field: "service_center",
      }, 
      description: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      scheduleDate: {
         type: DataTypes.DATE,
         allowNull: false,

         field: "scheduled_date",
      },
      completionDate: {
         type: DataTypes.DATE,

         allowNull: true,

         field: "completion_date",
      },
      odometerReading: {

         type: DataTypes.DECIMAL(12, 2),

         allowNull: false,

         field: "odometer_reading",

      },
      cost: {

         type: DataTypes.DECIMAL(12, 2),

         allowNull: true,

         defaultValue: 0,

      },
      remarks: {

         type: DataTypes.TEXT,

         allowNull: true,

      },

      status: {

         type: DataTypes.ENUM(
            ...MAINTENANCE_STATUS_VALUES
         ),

         defaultValue:

            MAINTENANCE_STATUS.SCHEDULED,

      },

      isDeleted: {

         type: DataTypes.BOOLEAN,

         defaultValue: false,

         field: "is_deleted",

      },
   },
   {

      tableName: "maintenance",
      freezeTableName: true,
      timestamps: true,
      indexes: [
         {
            fields: [
               "vehicle_id"
            ]
         },
         {
            fields: [
               "scheduled_date"
            ]
         },
         {
            fields: [
               "status"
            ]
         }
      ]
   }
);

/*
|--------------------------------------------------------------------------
| Instance Methods
|--------------------------------------------------------------------------
*/

Maintenance.prototype.isScheduled = function () {

   return this.status === MAINTENANCE_STATUS.SCHEDULED;

};

Maintenance.prototype.isInProgress = function () {

   return this.status === MAINTENANCE_STATUS.IN_PROGRESS;

};

Maintenance.prototype.isCompleted = function () {

   return this.status === MAINTENANCE_STATUS.COMPLETED;

};

Maintenance.prototype.isCancelled = function () {

   return this.status === MAINTENANCE_STATUS.CANCELLED;

};

export default Maintenance;
