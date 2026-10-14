import { ValidationError } from "../types/validation-error";

// Оборачивает список ошибок в единый формат ответа: { errorMessages: [...] }.
export const createErrorMessage = (
    errors: ValidationError[]
): { errorMessages: ValidationError[] } => {
    return { errorMessages: errors };
};
