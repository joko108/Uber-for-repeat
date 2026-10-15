import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repositories/drivers.repository";
import { createErrorMessages } from "../../core/middlewares/validation/input-validation-result.middleware";

export const getDriverHandler = (req: Request<{ id: string }>, res: Response) => {
    const driver = driversRepository.findById(+req.params.id);

    if (!driver) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.status(HttpStatus.Ok_200).send(driver);
};
