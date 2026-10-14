import { DriverInputDto } from "../dto/driver.input.dto";
import { ValidationError } from "../../core/types/validation-error";
import { VehicleFeature } from "../types/driver";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isInvalidString = (value: unknown, min: number, max: number): boolean =>
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max;

export const validateDriverInputDto = (data: DriverInputDto): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (isInvalidString(data.name, 2, 15)) {
        errors.push({ field: 'name', message: 'Invalid name' });
    }

    if (isInvalidString(data.phoneNumber, 8, 15)) {
        errors.push({ field: 'phoneNumber', message: 'Invalid phoneNumber' });
    }

    if (isInvalidString(data.email, 5, 50) || EMAIL_REGEX.test(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email' });
    }

    if (isInvalidString(data.vehicleMake, 3, 100)) {
        errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
    }

    if (isInvalidString(data.vehicleModel, 3, 100)) {
        errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
    }

    if (typeof data.vehicleYear !== "number") {
        errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
    }

    if (isInvalidString(data.vehicleLicensePlate, 6, 10)) {
        errors.push({
            field: 'vehicleLicensePlate',
            message: 'Invalid vehicleLicensePlate'
        });
    }

    if (
        data.vehicleDescription !== null &&
        isInvalidString(data.vehicleDescription, 10, 200)
    ) {
        errors.push({
            field: 'vehicleDescription',
            message: 'Invalid vehicleDescription'
        });
    }

    if (!Array.isArray(data.vehicleFeatures)) {
        errors.push({
            field: 'vehicleFeatures',
            message: 'vehicleFeatures must be an array'
        });
    } else {
        const validFeatures = Object.values(VehicleFeature);
        const hasInvalidFeatures = data.vehicleFeatures.some(
            (feature) => !validFeatures.includes(feature));

        if (hasInvalidFeatures) {
            errors.push({
                field: 'vehicleFeatures',
                message: 'Invalid vehicleFeatures'
            });
        }
    }

    return errors;
};
