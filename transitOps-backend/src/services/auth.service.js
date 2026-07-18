import db from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/jwt.js";

class AuthService {
   /*
   |--------------------------------------------------------------------------
   | LOGIN
   |--------------------------------------------------------------------------
   */
   async login(email, password) {
      const user = await db.User.scope("withPassword").findOne({
         where: {
            email,
         },

         include: [
            {
               model: db.Role,
               as: "role",
            },
         ],
      });

      if (!user) {
         throw new ApiError(401, "Invalid email or password.");
      }

      if (!user.isActive) {
         throw new ApiError(403, "User account has been disabled.");
      }

      const matched = await user.comparePassword(password);

      if (!matched) {
         throw new ApiError(401, "Invalid email or password.");
      }

      user.lastLogin = new Date();

      await user.save();

      const token = generateToken({
         id: user.id,

         email: user.email,

         role: user.role.name,
      });

      return {
         token,

         user: {
            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            role: user.role.name,
         },
      };
   }

   /*
   |--------------------------------------------------------------------------
   | REGISTER USER
   |--------------------------------------------------------------------------
   */

   async register(data) {
      const role = await db.Role.findByPk(data.roleId);

      if (!role) {
         throw new ApiError(404, "Role not found.");
      }

      const existingUser = await db.User.findOne({
         where: {
            email: data.email,
         },
      });

      if (existingUser) {
         throw new ApiError(409, "Email already exists.");
      }

      const user = await db.User.create({
         firstName: data.firstName,

         lastName: data.lastName,

         email: data.email,

         password: data.password,

         roleId: data.roleId,

         isActive: true,
      });

      return user;
   }

   /*
   |--------------------------------------------------------------------------
   | GET PROFILE
   |--------------------------------------------------------------------------
   */

   async profile(id) {
      const user = await db.User.findByPk(id, {
         include: [
            {
               model: db.Role,
               as: "role",
            },
         ],
      });

      if (!user) {
         throw new ApiError(404, "User not found.");
      }

      return user;
   }
}

export default new AuthService();