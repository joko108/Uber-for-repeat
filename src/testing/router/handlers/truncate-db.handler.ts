import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import {HttpStatus} from "../../../core/types/http-statuses";

// Полностью зачищает БД (используется в e2e-тестах перед прогоном).
export const truncateDbHandler = (_req: Request, res: Response) => {
    db.drivers = [];
    res.sendStatus(HttpStatus.NoContent_204);
};
