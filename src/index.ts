import express from "express";
import { setupApp } from "./setup-app";

const PORT = process.env.PORT || 3000;

// Экземпляр Express приложения.
const app = express();
setupApp(app);

// Запуск сервера.
app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
