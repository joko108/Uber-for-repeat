import express, { Express, Request, Response } from "express";
import { HttpStatus } from "./core/types/http-statuses";
import { driversRouter } from "./drivers/routers/dirvers.router";
import { testingRouter } from "./testing/router/testing.router";

export const setupApp = (app: Express) => {
    // Парсим JSON.
    app.use(express.json());

    // Health-check.
    app.get('/', (_req: Request, res: Response) => {
        res.status(HttpStatus.Ok_200).send('Hello World!');
    });

    // Каждый модуль подключается к своему базовому пути.
    app.use('/drivers', driversRouter);
    app.use('/testing', testingRouter)

    return app;
};
