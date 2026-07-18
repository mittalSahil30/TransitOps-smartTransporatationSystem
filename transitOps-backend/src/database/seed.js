import db from "../models/index.js";

const DEFAULT_ROLES = [
   {
      name: "Admin",
      description: "System Administrator",
   },
   {
      name: "Fleet Manager",
      description: "Manage fleet operations",
   },
   {
      name: "Dispatcher",
      description: "Manage trips and dispatch",
   },
   {
      name: "Safety Officer",
      description: "Driver compliance and safety",
   },
   {
      name: "Financial Analyst",
      description: "Expenses and reports",
   },
];

export async function seedDatabase() {
   try {
      console.log("🌱 Seeding database...");

      /*
      |--------------------------------------------------------------------------
      | Seed Roles
      |--------------------------------------------------------------------------
      */

      for (const role of DEFAULT_ROLES) {
         await db.Role.findOrCreate({
            where: {
               name: role.name,
            },
            defaults: role,
         });
      }

      /*
      |--------------------------------------------------------------------------
      | Seed Admin User
      |--------------------------------------------------------------------------
      */

      const adminRole = await db.Role.findOne({
         where: {
            name: "Admin",
         },
      });

      if (!adminRole) {
         throw new Error("Admin role not found.");
      }

      await db.User.findOrCreate({
         where: {
            email: "admin@transitops.com",
         },

         defaults: {
            firstName: "System",
            lastName: "Administrator",

            email: "admin@transitops.com",

            password: "Admin@123",

            roleId: adminRole.id,

            isActive: true,
         },
      });

      console.log("✅ Database Seed Completed");
   } catch (error) {
      console.error(error);
   }
}