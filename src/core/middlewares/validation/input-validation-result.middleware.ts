import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { ValidationErrorDto, ValidationErrorType } from "../../types/validation-error";
import { HttpStatus } from "../../types/http-statuses";

// Оборачивает список ошибок в единый формат ответа: { errorMessages: [...] }.
export const createErrorMessages = (
    errors: ValidationErrorType[]
): ValidationErrorDto => {
    return { errorMessages: errors };
};

// Хелпер, приводящий ошибки express-validator'а к нашему формату { field: ..., message: ... }.
// У ошибок типа 'field' (body/param - а других валидаторов у нас нет) есть доступ к полю.
const formatErrors = (error: ValidationError): ValidationErrorType => {
    if (error.type === 'field') {
        return { field: error.path, message: error.msg };
    }

    // Прочие ошибки express-validator'а у нас не используются.
    return { field: '', message: error.msg };
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest_400).json({ errorMessages: errors });
        return;
    }

    next();
};
