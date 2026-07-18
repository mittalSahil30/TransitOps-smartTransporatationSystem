import ApiError from "../utils/ApiError.js";

const authorize = (...allowedRoles) => {

   return (req, res, next) => {
      /*
      |--------------------------------------------------------------------------
      | User Exists?
      |--------------------------------------------------------------------------
      */
      if (!req.user) {

         return next(
            new ApiError(401, "Unauthorized.")
         );

      }

      /*
      |--------------------------------------------------------------------------
      | Role Allowed?
      |--------------------------------------------------------------------------
      */

      if (!allowedRoles.includes(req.user.role)) {

         return next(
            new ApiError(
               403,
               "You do not have permission to perform this action."
            )
         );

      }

      next();

   };

};

export default authorize;