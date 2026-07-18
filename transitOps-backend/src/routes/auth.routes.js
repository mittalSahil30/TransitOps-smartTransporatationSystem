import express from "express";

import authController from "../controllers/auth.controller.js";

import authenticate from "../middleware/auth.js";

import authorize from "../middleware/role.js";

import validator from "../middleware/validator.js";

import {

   loginValidator,

   registerValidator

} from "../validators/auth.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post(

   "/login",

   loginValidator,

   validator,

   authController.login

);

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

router.post(

   "/register",

   authenticate,

   authorize("Admin"),

   registerValidator,

   validator,

   authController.register

);

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

router.get(

   "/profile",

   authenticate,

   authController.profile

);

export default router;