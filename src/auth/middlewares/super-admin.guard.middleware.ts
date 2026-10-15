import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../settings/config";

// Basic Auth: пропускает дальше только запросы с корректными логином и паролем супер-админа.
export const superAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers['authorization'] as string;  // 'Basic xxxx'

    if (!auth) {
        res.sendStatus(HttpStatus.Unathorized_401);
        return;
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Basic') {
        res.sendStatus(HttpStatus.Unathorized_401);
        return;
    }

    // Декодируем base64 и разбиваем логин и пароль.
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HttpStatus.Unathorized_401);
        return;
    }

    next();
};
