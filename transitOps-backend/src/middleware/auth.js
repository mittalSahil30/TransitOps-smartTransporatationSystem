import db from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

const authenticate = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;
      /*
      |--------------------------------------------------------------------------
      | Authorization Header Exists?
      |--------------------------------------------------------------------------
      */
      if (!authHeader) {
         return next(
            new ApiError(401, "Authorization header is missing.")
         );
      }
      /*
      |--------------------------------------------------------------------------
      | Must be Bearer Token
      |--------------------------------------------------------------------------
      */

      if (!authHeader.startsWith("Bearer ")) {
         return next(
            new ApiError(401, "Invalid authorization format.")
         );
      }

      /*
      |--------------------------------------------------------------------------
      | Extract JWT
      |--------------------------------------------------------------------------
      */
      const token = authHeader.split(" ")[1];

      if (!token) {
         return next(
            new ApiError(401, "Token is missing.")
         );
      }

      /*
      |--------------------------------------------------------------------------
      | Verify JWT
      |--------------------------------------------------------------------------
      */

      const decoded = verifyToken(token);

      /*
      |--------------------------------------------------------------------------
      | Find User
      |--------------------------------------------------------------------------
      */

      const user = await db.User.findByPk(decoded.id, {

         include: [
            {
               model: db.Role,
               as: "role"
            }
         ]

      });

      if (!user) {
         return next(
            new ApiError(401, "User does not exist.")
         );
      }

      if (!user.isActive) {
         return next(
            new ApiError(403, "User account has been disabled.")
         );
      }

      /*
      |--------------------------------------------------------------------------
      | Attach User
      |--------------------------------------------------------------------------
      */

      req.user = {
         id: user.id,
         email: user.email,
         firstName: user.firstName,
         lastName: user.lastName,
         role: user.role.name
      };

      next();

   } catch (error) {

      return next(
         new ApiError(401, "Invalid or expired token.")
      );

   }
};

export default authenticate;