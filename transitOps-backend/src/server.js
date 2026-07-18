import app from "./app.js";
import db from "./models/index.js";
import env from "./config/env.js";
import { logger } from "./config/logger.js";
import { seedDatabase } from "./database/seed.js";

async function startServer() {

   try {
      /*
      |--------------------------------------------------------------------------
      | Database Connection
      |--------------------------------------------------------------------------
      */
      await db.sequelize.authenticate();

      logger.info("Database Connected.");
      /*
      |--------------------------------------------------------------------------
      | Sync Database
      |--------------------------------------------------------------------------
      */
      await db.sequelize.sync({

         alter: true

      });

      logger.info("Database Synced.");

      /*
      |--------------------------------------------------------------------------
      | Seed Default Data
      |--------------------------------------------------------------------------
      */

      await seedDatabase();

      /*
      |--------------------------------------------------------------------------
      | Start Server
      |--------------------------------------------------------------------------
      */

      app.listen(env.PORT, () => {
         logger.info(
            `Server running on http://localhost:${env.PORT}`
         );

      });

   }

   catch (error) {
      logger.error(error);
      process.exit(1);
   }

}

startServer();