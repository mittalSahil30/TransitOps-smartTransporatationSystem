import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (user) => {
   return jwt.sign(
      {
         id: user.id,
         role: user.role
      },
      env.JWT_SECRET,
      {
         expiresIn: env.JWT_EXPIRES_IN
      }
   );
}

/*
|--------------------------------------------------------------------------
| Verify JWT Token
|--------------------------------------------------------------------------
*/

export const verifyToken = (token) => {

   return jwt.verify(
      token,
      env.JWT_SECRET
   );

};

/*
|--------------------------------------------------------------------------
| Decode JWT (Without Verification)
|--------------------------------------------------------------------------
*/

export const decodeToken = (token) => {

   return jwt.decode(token);

};