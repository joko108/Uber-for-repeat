import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db }  from "../../db/in-memory.db";
import { createErrorMessage } from "../../core/utils/error.utils";

export const getDriverHandler = (req: Request<{ id: string }>, res: Response) => {
    const driver = db.drivers.find((d) => d.id === +req.params.id);

    if (!driver) {
        res
            .status(HttpStatus.NotFound_404)
            .send(
                createErrorMessage([{ field: 'id', message: 'Driver not found' }])
            );
        return;
    }

    res.status(HttpStatus.Ok_200).send(driver);
};
