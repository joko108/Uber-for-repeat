import { Request, Response, Router } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";
import { createErrorMessage } from "../../core/utils/error.utils";
import { Driver } from "../types/driver";
import { DriverInputDto } from "../dto/driver.input.dto";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";

// Отдельный роутер для маршрутов, связанных с водителями.
export const driversRouter = Router({});

driversRouter
    // Список всех водителей.
    .get('', (_req: Request, res: Response) => {
        res.status(HttpStatus.Ok_200).send(db.drivers);
    })

    // Один водитель по id.
    .get('/:id', (req: Request<{ id: string }>, res: Response) => {
        const driver = db.drivers.find((d) => d.id === +req.params.id);

        if (!driver) {
            res
                .status(HttpStatus.NotFound_404)
                .send(
                    createErrorMessage([{ field: 'id', message: 'Driver not found' }])
                );
            return;
        }

        res.status(HttpStatus.Ok_200).send(driver);
    })

    // Создание водителя.
    .post('', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
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
    })

    // Обновление данных водителя по id.
    .put('/:id', (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
        const index = db.drivers.findIndex((d) => d.id === +req.params.id);
        
        if (index === -1) {
            res
                .status(HttpStatus.NotFound_404)
                .send(
                    createErrorMessage([{ field: 'id', message: 'Driver not found' }])
                );
            return;
        }

        const errors = validateDriverInputDto(req.body);

        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
            return;
        }

        // Обновляем поля водителя, оставляя служебные id и createdAt.
        db.drivers[index] = { ...db.drivers[index], ...req.body };
        res.sendStatus(HttpStatus.NoContent_204);
    })

    // Удаление водителя по id.
    .delete('/:id', (req: Request<{ id: string }>, res: Response) => {
        const index = db.drivers.findIndex((d) => d.id === +req.params.id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound_404)
                .send(
                    createErrorMessage([{ field: 'id', message: 'Driver not found' }])
                );
            return;
        }

        db.drivers.splice(index, 1);
        res.sendStatus(HttpStatus.NoContent_204);
    });
