import { Op } from "sequelize";
import db from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import {
   VEHICLE_STATUS,
   MAINTENANCE_STATUS,
   MAINTENANCE_SORT_FIELDS
} from "../utils/constants.js";

const {
   sequelize,
   Maintenance,
   Vehicle
} = db;

class MaintenanceService {

   /*
   |--------------------------------------------------------------------------
   | PRIVATE - FIND MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async findMaintenance(id, transaction = null) {
      const maintenance = await Maintenance.findOne({
         where: {
            id,
            isDeleted: false
         },
         include: [
            {
               model: Vehicle,
               as: "vehicle"
            }
         ],
         transaction
      });

      if (!maintenance) {
         throw new ApiError(404, "Maintenance record not found.");
      }

      return maintenance;
   }

   /*
   |--------------------------------------------------------------------------
   | PRIVATE - CHECK DUPLICATE NUMBER
   |--------------------------------------------------------------------------
   */

   async checkDuplicateNumber(maintenanceNumber, maintenanceId = null) {
      const where = {
         maintenanceNumber,
         isDeleted: false
      };

      if (maintenanceId) {
         where.id = {
            [Op.ne]: maintenanceId
         };
      }

      const maintenance = await Maintenance.findOne({
         where
      });

      if (maintenance) {
         throw new ApiError(409, "Maintenance number already exists.");
      }
   }

   /*
   |--------------------------------------------------------------------------
   | PRIVATE - VALIDATE VEHICLE
   |--------------------------------------------------------------------------
   */

   async validateVehicle(vehicleId, transaction = null) {
      const vehicle = await Vehicle.findOne({
         where: {
            id: vehicleId,
            isDeleted: false
         },
         transaction
      });

      if (!vehicle) {
         throw new ApiError(404, "Vehicle not found.");
      }

      if (vehicle.status === VEHICLE_STATUS.RETIRED) {
         throw new ApiError(400, "Retired vehicles cannot be serviced.");
      }

      return vehicle;
   }

   /*
   |--------------------------------------------------------------------------
   | CREATE MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async createMaintenance(data) {
      await this.checkDuplicateNumber(data.maintenanceNumber);

      const transaction = await sequelize.transaction();

      try {
         const vehicle = await this.validateVehicle(
            data.vehicleId,
            transaction
         );

         const scheduledDate = new Date(data.scheduledDate);

         if (scheduledDate < new Date()) {
            throw new ApiError(
               400,
               "Scheduled date cannot be in the past."
            );
         }

         if (
            Number(data.odometerReading) <
            Number(vehicle.odometer)
         ) {
            throw new ApiError(
               400,
               "Maintenance odometer cannot be less than vehicle odometer."
            );
         }

         const maintenance = await Maintenance.create(
            {
               maintenanceNumber: data.maintenanceNumber,
               vehicleId: vehicle.id,
               maintenanceType: data.maintenanceType,
               serviceCenter: data.serviceCenter,
               description: data.description,
               scheduledDate: data.scheduledDate,
               odometerReading: data.odometerReading,
               cost: data.cost,
               remarks: data.remarks,
               status: MAINTENANCE_STATUS.SCHEDULED
            },
            {
               transaction
            }
         );

         await transaction.commit();

         return await this.getMaintenanceById(
            maintenance.id
         );

      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   /*
|--------------------------------------------------------------------------
| START MAINTENANCE
|--------------------------------------------------------------------------
*/

   async startMaintenance(id) {
      const transaction = await sequelize.transaction();

      try {
         const maintenance = await this.findMaintenance(id, transaction);

         if (!maintenance.isScheduled()) {
            throw new ApiError(
               400,
               "Only scheduled maintenance can be started."
            );
         }

         const vehicle = await this.validateVehicle(
            maintenance.vehicleId,
            transaction
         );

         if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
            throw new ApiError(
               400,
               "Vehicle is not available for maintenance."
            );
         }

         await maintenance.update(
            {
               status: MAINTENANCE_STATUS.IN_PROGRESS
            },
            {
               transaction
            }
         );

         await vehicle.update(
            {
               status: VEHICLE_STATUS.MAINTENANCE
            },
            {
               transaction
            }
         );

         await transaction.commit();

         return await this.getMaintenanceById(
            maintenance.id
         );

      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   /*
   |--------------------------------------------------------------------------
   | COMPLETE MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async completeMaintenance(id, data) {
      const transaction = await sequelize.transaction();

      try {
         const maintenance = await this.findMaintenance(id, transaction);

         if (!maintenance.isInProgress()) {
            throw new ApiError(
               400,
               "Only maintenance in progress can be completed."
            );
         }

         const vehicle = await this.validateVehicle(
            maintenance.vehicleId,
            transaction
         );

         const completionDate = new Date(
            data.completionDate || new Date()
         );

         if (
            completionDate <
            new Date(maintenance.scheduledDate)
         ) {
            throw new ApiError(
               400,
               "Completion date cannot be before scheduled date."
            );
         }

         await maintenance.update(
            {
               completionDate,
               cost:
                  data.cost ?? maintenance.cost,
               remarks:
                  data.remarks ?? maintenance.remarks,
               status:
                  MAINTENANCE_STATUS.COMPLETED
            },
            {
               transaction
            }
         );

         await vehicle.update(
            {
               status: VEHICLE_STATUS.AVAILABLE,
               odometer: maintenance.odometerReading
            },
            {
               transaction
            }
         );

         await transaction.commit();

         return await this.getMaintenanceById(
            maintenance.id
         );

      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   /*
   |--------------------------------------------------------------------------
   | CANCEL MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async cancelMaintenance(id, remarks) {
      const transaction = await sequelize.transaction();

      try {
         const maintenance = await this.findMaintenance(id, transaction);

         if (!maintenance.isScheduled()) {
            throw new ApiError(
               400,
               "Only scheduled maintenance can be cancelled."
            );
         }

         await maintenance.update(
            {
               status: MAINTENANCE_STATUS.CANCELLED,
               remarks:
                  remarks || maintenance.remarks
            },
            {
               transaction
            }
         );

         await transaction.commit();

         return await this.getMaintenanceById(
            maintenance.id
         );

      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   /*
|--------------------------------------------------------------------------
| GET MAINTENANCE BY ID
|--------------------------------------------------------------------------
*/

   async getMaintenanceById(id) {
      const maintenance = await this.findMaintenance(id);

      return maintenance.toJSON();
   }

   /*
   |--------------------------------------------------------------------------
   | GET ALL MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async getAllMaintenance(query) {
      const {
         page = 1,
         limit = 10,
         search = "",
         status,
         maintenanceType,
         vehicleId,
         sortBy = "createdAt",
         order = "DESC"
      } = query;

      const where = {
         isDeleted: false
      };

      if (search) {
         where[Op.or] = [
            {
               maintenanceNumber: {
                  [Op.like]: `%${search}%`
               }
            },
            {
               serviceCenter: {
                  [Op.like]: `%${search}%`
               }
            }
         ];
      }

      if (status) {
         where.status = status;
      }

      if (maintenanceType) {
         where.maintenanceType = maintenanceType;
      }

      if (vehicleId) {
         where.vehicleId = vehicleId;
      }

      const validSortField = MAINTENANCE_SORT_FIELDS.includes(sortBy)
         ? sortBy
         : "createdAt";

      const validOrder =
         order.toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

      const offset = (page - 1) * limit;

      const { rows, count } =
         await Maintenance.findAndCountAll({
            where,
            include: [
               {
                  model: Vehicle,
                  as: "vehicle"
               }
            ],
            order: [
               [
                  validSortField,
                  validOrder
               ]
            ],
            offset: Number(offset),
            limit: Number(limit)
         });

      return {
         maintenance: rows,
         pagination: {
            totalRecords: count,
            currentPage: Number(page),
            totalPages: Math.ceil(
               count / limit
            ),
            pageSize: Number(limit)
         }
      };
   }

   /*
   |--------------------------------------------------------------------------
   | DELETE MAINTENANCE
   |--------------------------------------------------------------------------
   */

   async deleteMaintenance(id) {
      const maintenance =
         await this.findMaintenance(id);

      if (maintenance.isInProgress()) {
         throw new ApiError(
            400,
            "Maintenance in progress cannot be deleted."
         );
      }

      await maintenance.update({
         isDeleted: true
      });

      return {
         message:
            "Maintenance deleted successfully."
      };
   }

}

export default new MaintenanceService();