import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db }  from "../../db/in-memory.db";

export const getDriverListHandler = (_req: Request, res: Response) => {
    res.status(HttpStatus.Ok_200).send(db.drivers);
};
