import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverInputDto } from "../dto/driver.input.dto";
import { createErrorMessage } from "../../core/utils/error.utils";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";
import { driversRepository } from "../repositories/drivers.repository";

export const updateDriverHandler = (
    req: Request<{ id: string }, {}, DriverInputDto>,
    res: Response
) => {
    const errors = validateDriverInputDto(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
        return;
    }

    const isUpdate = driversRepository.update(+req.params.id, req.body);

    // Репозиторий вернет false, если водитель с таким id не найден.
    if (!isUpdate) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessage([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
};
