import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import logger from "./utils/logger.js";

import users from "./router/stocks.router.js";
import billingRouter from "./router/billing.router.js";
import inventory from "./router/inventory.router.js";
import customers from "./router/customers.router.js";
import purchase from "./router/purchase.router.js";
import workflow from "./router/workflow.router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/billing", billingRouter);
app.use("/inventory", inventory);
app.use("/customers", customers);
app.use("/purchase", purchase);
app.use("/workflow", workflow);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

export const client = new MongoClient(MONGO_URL); //dialing operation
await client.connect(); //This is a calling operation

app.get("/", (req, res) => {
  logger.info("hello world");
  res.send({ message: "Hello world from Capstone backend !! " });
});

app.listen(PORT, () =>
  logger.info(`The Server is running on the port : ${PORT} 😉`),
);
