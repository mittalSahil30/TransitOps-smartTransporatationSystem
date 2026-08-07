/*
|--------------------------------------------------------------------------
| Vehicle Status
|--------------------------------------------------------------------------
*/

export const VEHICLE_STATUS = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
};

/*
|--------------------------------------------------------------------------
| Driver Status
|--------------------------------------------------------------------------
*/

export const DRIVER_STATUS = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    OFF_DUTY: "Off Duty",
    SUSPENDED: "Suspended",
};

/*
|--------------------------------------------------------------------------
| Trip Status
|--------------------------------------------------------------------------
*/

export const TRIP_STATUS = {
    DRAFT: "Draft",
    DISPATCHED: "Dispatched",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

/*
|--------------------------------------------------------------------------
| Vehicle Types
|--------------------------------------------------------------------------
*/

export const VEHICLE_TYPES = {
    TRUCK: "Truck",
    VAN: "Van",
    MINI_TRUCK: "Mini Truck",
    PICKUP: "Pickup",
    TRAILER: "Trailer",
    CONTAINER: "Container"
};

export const VEHICLE_TYPE_VALUES = Object.values(VEHICLE_TYPES);

/*
|--------------------------------------------------------------------------
| Driver Sort Fields
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Maintenance Types
|--------------------------------------------------------------------------
*/

export const MAINTENANCE_TYPES = {
    PREVENTIVE: "preventive",
    CORRECTIVE: "corrective",
    EMERGENCY: "Emergency"
};

export const MAINTENANCE_TYPE_VALUES =
    Object.values(MAINTENANCE_TYPES);

/*
|--------------------------------------------------------------------------
| Maintenance Status
|--------------------------------------------------------------------------
*/

export const MAINTENANCE_STATUS = {
    SCHEDULED: "scheduled",
    IN_PROGRESS: "in-Progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};

export const MAINTENANCE_STATUS_VALUES =
    Object.values(MAINTENANCE_STATUS);

/*
|--------------------------------------------------------------------------
| Maintenance Sort Fields
|--------------------------------------------------------------------------
*/

export const MAINTENANCE_SORT_FIELDS = [
    "maintenanceNumber",
    "scheduledDate",
    "completionDate",
    "cost",
    "status",
    "createdAt"
];

/*
|--------------------------------------------------------------------------
| Fuel Types
|--------------------------------------------------------------------------
*/

export const FUEL_TYPES = {
    DIESEL: "Diesel",
    PETROL: "Petrol",
    CNG: "CNG",
    LNG: "LNG",
    ELECTRIC: "Electric"
};

export const FUEL_TYPE_VALUES =
    Object.values(FUEL_TYPES);

/*
|--------------------------------------------------------------------------
| Payment Methods
|--------------------------------------------------------------------------
*/

export const PAYMENT_METHODS = {
    CASH: "Cash",
    CARD: "Card",
    UPI: "UPI",
    COMPANY_ACCOUNT: "Company Account"
};

export const PAYMENT_METHOD_VALUES =
    Object.values(PAYMENT_METHODS);

/*
|--------------------------------------------------------------------------
| Fuel Sort Fields
|--------------------------------------------------------------------------
*/

export const FUEL_SORT_FIELDS = [
    "filledAt",
    "quantity",
    "totalCost",
    "createdAt"
];

export const EXPENSE_TYPES = {
    TOLL: "Toll",
    PARKING : "Parking",
    DRIVER_ALLOWANCE: "Driver Allowance",
    LOADING: "Loading",
    UNLOADING: "Unloading",
    Repair: "Repair",
    INSURANCE: "Insurance",
    PERMIT: "Permit",
    OTHER: "Other"
}

export const EXPENSE_SORT_FIELDS = [
    "expenseNumber",
    "expenseDate",
    "expenseType",
    "amount",
    "createdAt"
];

export const EXPENSE_TYPE_VALUES = Object.values(EXPENSE_TYPES);