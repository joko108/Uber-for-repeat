import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./settings/config";

// Экземпляр Express приложения.
const app = express();
setupApp(app);

const PORT = SETTINGS.PORT;

// Запуск сервера.
app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
