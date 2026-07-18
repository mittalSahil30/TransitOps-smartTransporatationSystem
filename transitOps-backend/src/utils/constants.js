export const VEHICLE_STATUS = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
};

export const DRIVER_STATUS = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    OFF_DUTY: "Off Duty",
    SUSPENDED: "Suspended",
};

export const TRIP_STATUS = {
    DRAFT: "Draft",
    DISPATCHED: "Dispatched",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

export const VEHICLE_TYPES = [
    "Truck",
    "Van",
    "Mini Truck",
    "Pickup",
    "Trailer",
    "Container",
];

export const DRIVER_SORT_FIELDS = [
    "employeeId",
    "firstName",
    "lastName",
    "email",
    "licenseExpiry",
    "status",
    "createdAt",
];

/*
|--------------------------------------------------------------------------
| Trip Sort Fields
|--------------------------------------------------------------------------
*/

export const TRIP_SORT_FIELDS = [
    "tripNumber",
    "departureTime",
    "expectedArrival",
    "status",
    "createdAt",
];