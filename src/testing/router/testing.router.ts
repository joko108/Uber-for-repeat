import { Request, Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/in-memory.db";

// Служебный роутер для тестов. Подключается к базовому пути '/testing'.
export const testingRouter = Router({});

// Тестовый эндпоинт: полностью зачищает данные в БД (для e2e-тестов).
testingRouter.delete('/all-data', (_req: Request, res: Response) => {
        db.drivers = [];
        res.sendStatus(HttpStatus.NoContent_204);
    });
