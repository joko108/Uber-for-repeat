import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { createErrorMessage } from "../../core/utils/error.utils";
import { driversRepository } from "../repositories/drivers.repository";

export const deleteDriverHandler = (req: Request<{ id: string }>, res: Response) => {
    const isDeleted = driversRepository.delete(+req.params.id);

    if (!isDeleted) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessage([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
};
