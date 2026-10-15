import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverInputDto } from "../dto/driver.input.dto";
import { driversRepository } from "../repositories/drivers.repository";
import { createErrorMessages } from "../../core/middlewares/validation/input-validation-result.middleware";

export const updateDriverHandler = (
    req: Request<{ id: string }, {}, DriverInputDto>,
    res: Response
) => {

    // Тело и id уже проверены middleware-валидаторами.
    const isUpdate = driversRepository.update(+req.params.id, req.body);
    // Репозиторий вернет false, если водитель с таким id не найден.
    if (!isUpdate) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessages([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
};
