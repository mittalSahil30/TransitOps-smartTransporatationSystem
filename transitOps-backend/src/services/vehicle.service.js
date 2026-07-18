import { Op } from "sequelize";

import Vehicle from "../models/Vehicle.js";

import ApiError from "../utils/ApiError.js";

import {
   VEHICLE_STATUS
} from "../utils/constants.js";

class VehicleService {

   /*
   |--------------------------------------------------------------------------
   | Private Method
   | Check Registration Exists
   |--------------------------------------------------------------------------
   */

   async checkRegistrationExists(registrationNumber, vehicleId = null) {

      const where = {
         registrationNumber,
         isDeleted: false
      };

      if (vehicleId) {

         where.id = {
            [Op.ne]: vehicleId
         };

      }

      const vehicle = await Vehicle.findOne({
         where
      });

      if (vehicle) {

         throw new ApiError(
            409,
            "Vehicle registration number already exists."
         );

      }

   }

   /*
   |--------------------------------------------------------------------------
   | Private Method
   | Find Vehicle
   |--------------------------------------------------------------------------
   */

   async findVehicle(id) {

      const vehicle = await Vehicle.findOne({

         where: {
            id,
            isDeleted: false
         }

      });

      if (!vehicle) {

         throw new ApiError(
            404,
            "Vehicle not found."
         );

      }

      return vehicle;

   }

   /*
   |--------------------------------------------------------------------------
   | CREATE VEHICLE
   |--------------------------------------------------------------------------
   */

   async createVehicle(data) {

      /*
      ---------------------------------------
      Duplicate Registration
      ---------------------------------------
      */

      await this.checkRegistrationExists(
         data.registrationNumber
      );

      /*
      ---------------------------------------
      Create Vehicle
      ---------------------------------------
      */

      const vehicle = await Vehicle.create({

         registrationNumber: data.registrationNumber,

         vehicleName: data.vehicleName,

         model: data.model,

         vehicleType: data.vehicleType,

         maxLoadCapacity: data.maxLoadCapacity,

         odometer: data.odometer,

         acquisitionCost: data.acquisitionCost,

         region: data.region,

         status:
            data.status ||
            VEHICLE_STATUS.AVAILABLE

      });

      return vehicle.toJSON();

   }

   /*
   |--------------------------------------------------------------------------
   | UPDATE VEHICLE
   |--------------------------------------------------------------------------
   */

   async updateVehicle(id, data) {

      /*
      ---------------------------------------
      Find Vehicle
      ---------------------------------------
      */

      const vehicle = await this.findVehicle(id);

      /*
      ---------------------------------------
      Duplicate Registration
      ---------------------------------------
      */

      if (
         data.registrationNumber &&
         data.registrationNumber !== vehicle.registrationNumber
      ) {

         await this.checkRegistrationExists(

            data.registrationNumber,

            vehicle.id

         );

      }

      /*
      ---------------------------------------
      Update
      ---------------------------------------
      */

      await vehicle.update({

         registrationNumber:
            data.registrationNumber ??
            vehicle.registrationNumber,

         vehicleName:
            data.vehicleName ??
            vehicle.vehicleName,

         model:
            data.model ??
            vehicle.model,

         vehicleType:
            data.vehicleType ??
            vehicle.vehicleType,

         maxLoadCapacity:
            data.maxLoadCapacity ??
            vehicle.maxLoadCapacity,

         odometer:
            data.odometer ??
            vehicle.odometer,

         acquisitionCost:
            data.acquisitionCost ??
            vehicle.acquisitionCost,

         region:
            data.region ??
            vehicle.region,

         status:
            data.status ??
            vehicle.status

      });

      return vehicle;

   }

   /*
|--------------------------------------------------------------------------
| GET VEHICLE BY ID
|--------------------------------------------------------------------------
*/

   async getVehicleById(id) {

      return await this.findVehicle(id);

   }

   /*
|--------------------------------------------------------------------------
| GET ALL VEHICLES
|--------------------------------------------------------------------------
*/

   async getAllVehicles(query) {

      const {

         page = 1,

         limit = 10,

         search,

         status,

         type,

         region,

         sortBy = "createdAt",

         order = "DESC"

      } = query;

      const where = {

         isDeleted: false

      };

      /*
      |--------------------------------------------------------------------------
      | Search
      |--------------------------------------------------------------------------
      */

      if (search) {

         where[Op.or] = [

            {

               registrationNumber: {

                  [Op.like]: `%${search}%`

               }

            },

            {

               vehicleName: {

                  [Op.like]: `%${search}%`

               }

            },

            {

               model: {

                  [Op.like]: `%${search}%`

               }

            }

         ];

      }

      /*
      |--------------------------------------------------------------------------
      | Filters
      |--------------------------------------------------------------------------
      */

      if (status) {

         where.status = status;

      }

      if (type) {

         where.vehicleType = type;

      }

      if (region) {

         where.region = region;

      }

      /*
      |--------------------------------------------------------------------------
      | Pagination
      |--------------------------------------------------------------------------
      */

      const offset =

         (page - 1) * limit;

      const result =

         await Vehicle.findAndCountAll({

            where,

            limit: Number(limit),

            offset,

            order: [

               [

                  sortBy,

                  order

               ]

            ]

         });

      return {

         vehicles: result.rows,

         pagination: {

            total: result.count,

            page: Number(page),

            limit: Number(limit),

            totalPages:

               Math.ceil(

                  result.count /

                  limit

               )

         }

      };

   }


   /*
|--------------------------------------------------------------------------
| DELETE VEHICLE (SOFT DELETE)
|--------------------------------------------------------------------------
*/

   async deleteVehicle(id) {

      const vehicle = await this.findVehicle(id);

      /*
      |--------------------------------------------------------------------------
      | Prevent deleting vehicle currently on trip
      |--------------------------------------------------------------------------
      */

      if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {

         throw new ApiError(
            400,
            "Vehicle currently assigned to a trip."
         );

      }

      /*
      |--------------------------------------------------------------------------
      | Soft Delete
      |--------------------------------------------------------------------------
      */

      await vehicle.update({

         isDeleted: true

      });

      return {

         message: "Vehicle deleted successfully."

      };

   }

   /*
|--------------------------------------------------------------------------
| GET AVAILABLE VEHICLES
|--------------------------------------------------------------------------
*/

   async getAvailableVehicles() {

      const vehicles = await Vehicle.findAll({

         where: {

            isDeleted: false,

            status: VEHICLE_STATUS.AVAILABLE

         },

         order: [

            ["vehicleName", "ASC"]

         ]

      });

      return vehicles;

   }

}

export default new VehicleService();