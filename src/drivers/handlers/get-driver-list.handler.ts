import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repositories/drivers.repository";

export const getDriverListHandler = (_req: Request, res: Response) => {
    res.status(HttpStatus.Ok_200).send(driversRepository.findAll());
};
