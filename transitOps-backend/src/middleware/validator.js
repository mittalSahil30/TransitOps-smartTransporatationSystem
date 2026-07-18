import { validationResult } from "express-validator";

const validator = (req, res, next) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {

      return res.status(422).json({

         success: false,

         statusCode: 422,

         message: "Validation Failed",

         errors: errors.array()

      });

   }

   next();

};

export default validator;