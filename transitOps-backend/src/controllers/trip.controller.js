import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../utils/httpStatus.js";
import tripService from "../services/trip.service.js";

class TripController {

    /*
    |--------------------------------------------------------------------------
    | CREATE TRIP
    |--------------------------------------------------------------------------
    */

    createTrip = asyncHandler(async (req, res) => {

        const trip = await tripService.createTrip(req.body);

        return res.status(HTTP_STATUS.CREATED).json(

            new ApiResponse(

                HTTP_STATUS.CREATED,

                "Trip created successfully.",

                trip

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | GET ALL TRIPS
    |--------------------------------------------------------------------------
    */

    getAllTrips = asyncHandler(async (req, res) => {

        const result = await tripService.getAllTrips(req.query);

        return res.status(HTTP_STATUS.OK).json(

            new ApiResponse(

                HTTP_STATUS.OK,

                "Trips fetched successfully.",

                result

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | GET TRIP BY ID
    |--------------------------------------------------------------------------
    */

    getTripById = asyncHandler(async (req, res) => {

        const trip = await tripService.getTripById(

            req.params.id

        );

        return res.status(HTTP_STATUS.OK).json(

            new ApiResponse(

                HTTP_STATUS.OK,

                "Trip fetched successfully.",

                trip

            )

        );

    });

    /*
|--------------------------------------------------------------------------
| DISPATCH TRIP
|--------------------------------------------------------------------------
*/

dispatchTrip = asyncHandler(async (req, res) => {

    const trip = await tripService.dispatchTrip(

        req.params.id

    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Trip dispatched successfully.",

            trip

        )

    );

});

/*
|--------------------------------------------------------------------------
| COMPLETE TRIP
|--------------------------------------------------------------------------
*/

completeTrip = asyncHandler(async (req, res) => {

    const trip = await tripService.completeTrip(

        req.params.id,

        req.body

    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Trip completed successfully.",

            trip

        )

    );

});

/*
|--------------------------------------------------------------------------
| CANCEL TRIP
|--------------------------------------------------------------------------
*/

cancelTrip = asyncHandler(async (req, res) => {

    const trip = await tripService.cancelTrip(

        req.params.id,

        req.body.remarks

    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            "Trip cancelled successfully.",

            trip

        )

    );

});

/*
|--------------------------------------------------------------------------
| DELETE TRIP
|--------------------------------------------------------------------------
*/

deleteTrip = asyncHandler(async (req, res) => {

    const result = await tripService.deleteTrip(

        req.params.id

    );

    return res.status(HTTP_STATUS.OK).json(

        new ApiResponse(

            HTTP_STATUS.OK,

            result.message,

            null

        )

    );

});






}

export default new TripController();