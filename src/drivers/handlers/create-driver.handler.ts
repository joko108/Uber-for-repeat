import { Request, Response } from "express";
import { DriverInputDto } from "../dto/driver.input.dto";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";
import { HttpStatus } from "../../core/types/http-statuses";
import { createErrorMessage } from "../../core/utils/error.utils";
import { db } from "../../db/in-memory.db";
import { Driver } from "../types/driver";

export const createDriverHandler = (req: Request<{}, {}, DriverInputDto>, res: Response) => {
    const errors = validateDriverInputDto(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
        return;
    }

    const lastDriver = db.drivers[db.drivers.length - 1];

    const newDriver: Driver = {
        id: lastDriver ? lastDriver.id + 1 : 1,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        vehicleMake: req.body.vehicleMake,
        vehicleModel: req.body.vehicleModel,
        vehicleYear: req.body.vehicleYear,
        vehicleLicensePlate: req.body.vehicleLicensePlate,
        vehicleDescription: req.body.vehicleDescription,
        vehicleFeatures: req.body.vehicleFeatures,
        createdAt: new Date(),
    };

    db.drivers.push(newDriver);
    res.status(HttpStatus.Created_201).send(newDriver);
};
