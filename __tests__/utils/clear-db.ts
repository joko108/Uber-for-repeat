import request from "supertest";
import { Express } from "express";
import { TESTING_PATH, TESTING_ROUTES } from "../../src/testing/constants/testing.paths";
import { HttpStatus } from "../../src/core/types/http-statuses";

// Полностью зачищаем БД через тестовый эндпоинт (перед прогоном теста).
export const clearDb = async (app: Express) => {
    await request(app)
        .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
        .expect(HttpStatus.NoContent_204);
};
