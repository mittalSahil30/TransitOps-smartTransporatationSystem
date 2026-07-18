import asyncHandler from "../middleware/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

class AuthController {

   /*
   |--------------------------------------------------------------------------
   | LOGIN
   |--------------------------------------------------------------------------
   */

   login = asyncHandler(async (req, res) => {

      const { email, password } = req.body;

      const data = await authService.login(
         email,
         password
      );

      return res.status(200).json(

         new ApiResponse(

            200,

            "Login Successful",

            data

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | REGISTER
   |--------------------------------------------------------------------------
   */

   register = asyncHandler(async (req, res) => {

      const user = await authService.register(req.body);

      return res.status(201).json(

         new ApiResponse(

            201,

            "User Registered Successfully",

            user

         )

      );

   });

   /*
   |--------------------------------------------------------------------------
   | PROFILE
   |--------------------------------------------------------------------------
   */

   profile = asyncHandler(async (req, res) => {

      const user = await authService.profile(
         req.user.id
      );

      return res.status(200).json(

         new ApiResponse(

            200,

            "Profile Loaded",

            user

         )

      );

   });

}

export default new AuthController();