import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverInputDto } from "../dto/driver.input.dto";
import { db } from "../../db/in-memory.db";
import { createErrorMessage } from "../../core/utils/error.utils";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";

export const updateDriverHandler = (
    req: Request<{ id: string }, {}, DriverInputDto>,
    res: Response
) => {
    const index = db.drivers.findIndex((d) => d.id === +req.params.id);

    if (index === -1) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessage([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    const errors = validateDriverInputDto(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
        return;
    }

    // Обновляем поля водителя, оставляя служебные id и createdAt.
    db.drivers[index] = { ...db.drivers[index], ...req.body };
    res.sendStatus(HttpStatus.NoContent_204);
};
