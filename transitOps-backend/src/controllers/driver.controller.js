import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../utils/httpStatus.js";
import driverService from "../services/driver.service.js";

class DriverController {
    /*
    |--------------------------------------------------------------------------
    | Create Driver
    |--------------------------------------------------------------------------
    */
    createDriver = asyncHandler(async (req, res) => {

        const driver = await driverService.createDriver(req.body);

        return res.status(HTTP_STATUS.CREATED).json(

            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Driver created successfully.",
                driver
            )

        );

    });
    /*
    |--------------------------------------------------------------------------
    | Update Driver
    |--------------------------------------------------------------------------
    */
    updateDriver = asyncHandler(async (req, res) => {

        const driver = await driverService.updateDriver(
            req.params.id,
            req.body
        );

        return res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Driver updated successfully.",
                driver
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Get Driver By Id
    |--------------------------------------------------------------------------
    */

    getDriverById = asyncHandler(async (req, res) => {
        const driver = await driverService.getDriverById(
            req.params.id
        );

        return res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Driver fetched successfully.",
                driver
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Get All Drivers
    |--------------------------------------------------------------------------
    */

    getAllDrivers = asyncHandler(async (req, res) => {

        const result = await driverService.getAllDrivers(
            req.query
        );
        return res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Drivers fetched successfully.",
                result
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Available Drivers
    |--------------------------------------------------------------------------
    */

    getAvailableDrivers = asyncHandler(async (req, res) => {
        const drivers = await driverService.getAvailableDrivers();
        return res.status(HTTP_STATUS.OK).json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Available drivers fetched successfully.",
                drivers
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Delete Driver
    |--------------------------------------------------------------------------
    */

    deleteDriver = asyncHandler(async (req, res) => {

        const result = await driverService.deleteDriver(
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

export default new DriverController();