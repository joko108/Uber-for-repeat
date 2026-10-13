import express, { Express, Request, Response } from "express";
import { HttpStatuses } from "./core/http-statuses";
import { db } from "./db/in-memory.db";
import { DriverInputDto } from "./drivers/dto/driver.input.dto";
import { Driver } from "./drivers/types/driver";

export const setupApp = (app: Express) => {
    // Парсим JSON.
    app.use(express.json());

    // Health-check.
    app.get('/', (_req: Request, res: Response) => {
        res.status(HttpStatuses.Ok_200).send('Hello World!');
    });

    // Список всех водителей.
    app.get('/drivers', (_req: Request, res: Response) => {
        res.status(HttpStatuses.Ok_200).send(db.drivers);
    });

    // Один водитель по id.
    app.get('/drivers/:id', (req: Request<{ id: string }>, res: Response) => {
        const driver = db.drivers.find((d) => d.id === +req.params.id);

        if (!driver) {
            res.sendStatus(HttpStatuses.NotFound_404);
            return;
        }

        res.status(HttpStatuses.Ok_200).send(driver);
    });

    // Создание водителя.
    app.post('/drivers', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
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
        res.status(HttpStatuses.Created_201).send(newDriver);
    });

    // Тестовый эндпоинт: полностью зачищает данные в БД (для e2e-тестов).
    app.delete('/testing/all-data', (_req: Request, res: Response) => {
        db.drivers = [];
        res.sendStatus(HttpStatuses.NoContent_204);
    });

    return app;
};
