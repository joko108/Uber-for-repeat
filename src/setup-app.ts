import express, { Express, Request, Response } from "express";

export const setupApp = (app: Express) => {
    // Парсим JSON.
    app.use(express.json());

    // Health-check.
    app.get('/', (_req: Request, res: Response) => {
        res.status(200).send('Hello World!');
    });

    return app;
};
