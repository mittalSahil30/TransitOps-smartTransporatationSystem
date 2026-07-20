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

export const MAINTAINCE_TYPES = [
    "preventive",
    "corrective",
    "Emergency"
];

export const MAINTAINCE_STATUS = [
    "scheduled",
    "in-Progress",
    "completed",
    "cancelled"
];

export const MAINTENANCE_SORT_FIELDS = [

    "maintenanceNumber",

    "scheduledDate",

    "completionDate",

    "cost",

    "status",

    "createdAt"

];

/* ===========================================
   FUEL TYPES
=========================================== */

export const FUEL_TYPES = {
    DIESEL: "Diesel",
    PETROL: "Petrol",
    CNG: "CNG",
    LNG: "LNG",
    ELECTRIC: "Electric"
};

export const FUEL_TYPE_VALUES = Object.values(FUEL_TYPES);

/* ===========================================
   PAYMENT METHODS
=========================================== */

export const PAYMENT_METHODS = {
    CASH: "Cash",
    CARD: "Card",
    UPI: "UPI",
    COMPANY_ACCOUNT: "Company Account"
};

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHODS);

/* ===========================================
   FUEL SORT FIELDS
=========================================== */

export const FUEL_SORT_FIELDS = [
    "filledAt",
    "quantity",
    "totalCost",
    "createdAt"
];