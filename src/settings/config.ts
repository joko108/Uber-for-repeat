const env = process.env;

// Логин и пароль суперадмина (можно переопределить в переменной окружения).
export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const SETTINGS = {
    PORT: env.PORT || 3000,
};
