import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repositories/drivers.repository";
import { createErrorMessages } from "../../core/middlewares/validation/input-validation-result.middleware";

export const deleteDriverHandler = (req: Request<{ id: string }>, res: Response) => {
    const isDeleted = driversRepository.delete(+req.params.id);

    if (!isDeleted) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
};
