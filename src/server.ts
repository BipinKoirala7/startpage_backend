import express from "express";
import { config } from "dotenv";
import cors from "cors";

import apiRouter from "./routes/routes";

config();

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
    console.log("The server is running in the port " + process.env.PORT);
});