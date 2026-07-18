import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Vehicle = sequelize.define(
   "Vehicle",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },

      registrationNumber: {
         type: DataTypes.STRING(30),
         allowNull: false,
         unique: {
            msg: "Registration number already exists.",
         },
         field: "registration_number",
         validate: {
            notEmpty: {
               msg: "Registration number is required.",
            },
         },
      },

      vehicleName: {
         type: DataTypes.STRING(100),
         allowNull: false,
         field: "vehicle_name",
         validate: {
            notEmpty: {
               msg: "Vehicle name is required.",
            },
         },
      },

      model: {
         type: DataTypes.STRING(100),
         allowNull: false,
         validate: {
            notEmpty: {
               msg: "Vehicle model is required.",
            },
         },
      },

      vehicleType: {
         type: DataTypes.ENUM(
            "Truck",
            "Van",
            "Mini Truck",
            "Pickup",
            "Trailer",
            "Container"
         ),
         allowNull: false,
         field: "vehicle_type",
      },

      maxLoadCapacity: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         field: "max_load_capacity",
         validate: {
            min: {
               args: [1],
               msg: "Capacity must be greater than zero.",
            },
         },
      },

      odometer: {
         type: DataTypes.DECIMAL(12, 2),
         allowNull: false,
         defaultValue: 0,
         validate: {
            min: {
               args: [0],
               msg: "Odometer cannot be negative.",
            },
         },
      },

      acquisitionCost: {
         type: DataTypes.DECIMAL(15, 2),
         allowNull: false,
         field: "acquisition_cost",
         validate: {
            min: {
               args: [0],
               msg: "Acquisition cost cannot be negative.",
            },
         },
      },

      region: {
         type: DataTypes.STRING(100),
         allowNull: false,
      },

      status: {
         type: DataTypes.ENUM(
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
         ),
         defaultValue: "Available",
      },

      isDeleted: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
         field: "is_deleted",
      },
   },
   {
      tableName: "vehicles",

      timestamps: true,

      freezeTableName: true,

      indexes: [
         {
            unique: true,
            fields: ["registration_number"],
         },
         {
            fields: ["status"],
         },
         {
            fields: ["vehicle_type"],
         },
         {
            fields: ["region"],
         },
      ],
   }
);

export default Vehicle;