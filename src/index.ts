import express, { Request, Response } from "express";
import { setupApp } from "./setup-app";

const PORT = process.env.PORT || 3000;

// Экземляр Express приложения.
const app = express();
setupApp(app);

// Запуск сервера.
app.listen(PORT, () => {
    console.log(`Expample app listening on port: ${PORT}`);
});
