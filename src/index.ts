import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
