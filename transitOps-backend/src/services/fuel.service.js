import { Op } from "sequelize";
import sequelize from "../config/database.js";
import Fuel from "../models/Fuel.js";
import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";

import { FUEL_SORT_FIELDS } from "../utils/constants.js";


class FuelService {
   async createFuelLog(data) {
      const existingReceipt = await Fuel.findOne({
         where: {
            receiptNumber: data.receiptNumber
         }
      });

      if (existingReceipt) {
         throw new Error("Receipt number already exists.");
      }

      const vehicle = await Vehicle.findByPk(data.vehicleId);

      if (!vehicle) {
         throw new Error("Vehicle not found.");
      }

      if (data.tripId) {

         const trip = await Trip.findByPk(data.tripId);

         if (!trip) {
            throw new Error("Trip not found.");
         }

      }


      if (data.odometerReading < vehicle.currentOdometer) {
         throw new Error(
            "Odometer reading cannot be less than vehicle odometer."
         );
      }

      try {
         const transaction = await sequelize.transaction();

         const fuel = await Fuel.create(data, {
            transaction
         });

         await vehicle.update(
            {
               currentOdometer: data.odometerReading
            },
            {
               transaction
            }
         );


         await transaction.commit();
      } catch(error) {
         await transaction.rollback();
         throw error;
      }

      return fuel;
   }

   async getFuelLogById(id) {

      const fuel = await Fuel.findByPk(id, {

         include: [

            {
               model: Vehicle,
               as: "vehicle"
            },

            {
               model: Trip,
               as: "trip"
            }

         ]

      });

      if (!fuel) {

         throw new Error("Fuel log not found.");

      }

      return fuel;

   }

   async getAllFuelLogs(query) {
      const {
         page = 1,
         limit = 10,
         search,
         vehicleId,
         tripId,
         fuelType,
         paymentMethod,
         sortBy = "filledAt",
         order = "DESC"
      } = query;

      const where = {};

      // Vehicle Filter
      if (vehicleId) {
         where.vehicleId = vehicleId;
      }

      // Trip Filter
      if (tripId) {
         where.tripId = tripId;
      }

      // Fuel Type Filter
      if (fuelType) {
         where.fuelType = fuelType;
      }

      // Payment Method Filter
      if (paymentMethod) {
         where.paymentMethod = paymentMethod;
      }

      // Search by Receipt Number or Station Name
      if (search) {
         where[Op.or] = [
            {
               receiptNumber: {
                  [Op.like]: `%${search}%`
               }
            },
            {
               stationName: {
                  [Op.like]: `%${search}%`
               }
            }
         ];
      }

      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const offset = (pageNumber - 1) * pageSize;

      const validSortField = FUEL_SORT_FIELDS.includes(sortBy)
         ? sortBy
         : "filledAt";

      const validOrder =
         order.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const { count, rows } = await Fuel.findAndCountAll({
         where,
         include: [
            {
               model: Vehicle,
               as: "vehicle",
               attributes: [
                  "id",
                  "registrationNumber",
                  "vehicleName"
               ]
            },
            {
               model: Trip,
               as: "trip",
               attributes: [
                  "id",
                  "tripNumber"
               ],
               required: false
            }
         ],
         limit: pageSize,
         offset,
         order: [[validSortField, validOrder]]
      });

      return {
         fuelLogs: rows,
         pagination: {
            totalRecords: count,
            currentPage: pageNumber,
            totalPages: Math.ceil(count / pageSize),
            pageSize
         }
      };
   }

   async deleteFuelLog(id) {

      const fuel = await Fuel.findByPk(id);

      if (!fuel) {

         throw new Error("Fuel log not found.");

      }

      await fuel.destroy();

      return true;

   }
}

export default new FuelService;