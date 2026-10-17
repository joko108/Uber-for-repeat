import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../src/settings/config";

// Генерация auth (для e2e-тестов).
export const generateAdminAuthToken = () => {
    const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
    const token = Buffer.from(credentials).toString('base64');
    return `Basic ${token}`;
};
