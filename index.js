import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import billingRouter from "./router/billing.router.js";
import inventory from "./router/inventory.router.js";
import customers from "./router/customers.router.js";
import purchase from "./router/purchase.router.js";
import workflow from "./router/workflow.router.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/billing", billingRouter);
app.use("/inventory", inventory);
app.use("/customers", customers);
app.use("/purchase", purchase);
app.use("/workflow", workflow);

const PORT = 4000;
const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); //dialing operation
await client.connect(); //This is a calling operation

app.get("/", (request, response) => {
  console.log("Hello World");
});

app.listen(PORT, () =>
  console.log(`The Server is running on the port : ${PORT} 😉`)
);

async function getHashedPassword(password) {
  const No_of_Rounds = 10;
  const salt = await bcrypt.genSalt(No_of_Rounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

//signup action
app.post("/signup", async (req, res) => {
  const { username, email, password, jobRole } = req.body;
  if (email == null || email == "")
    response.status(401).send({ message: "Enter valid Email-addresss 😮" });
  else {
    const checkEmailfromDB = await client
      .db("capstone")
      .collection("users")
      .findOne({ email, username });
    if (checkEmailfromDB)
      res.status(401).send({
        message: "User Id already exists, pls login and continue !!!!",
      });
    else {
      const hashedPassword = await getHashedPassword(password);
      let cadreID;
      if (jobRole == "stores") cadreID = 1;
      if (jobRole == "manager") cadreID = 2;
      if (jobRole == "accounts") cadreID = 3;
      if (jobRole == "head") cadreID = 4;
      if (jobRole == "admin") cadreID = 5;

      const newUserSignup = await client
        .db("capstone")
        .collection("users")
        .insertOne({
          username,
          password: hashedPassword,
          email,
          jobRole,
          cadreID,
        });
      newUserSignup
        ? res.send({ message: "New User Registered Successfully" })
        : res.status(401).send({ message: "failed to register user" });
    }
  }
});

//signin action
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const checkUserinDB = await client
    .db("capstone")
    .collection("users")
    .findOne({ username });
  if (!checkUserinDB) res.status(401).send({ message: "User Doesn't exists" });
  else {
    const storedPassword = checkUserinDB.password;
    console.log(storedPassword);
    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    if (!isPasswordValid)
      res.status(401).send({ message: "Invalid credentials" });
    const token = jwt.sign({ _id: checkUserinDB._id }, process.env.SECRET_KEY);
    res.send({
      message: "Login Success",
      token,
      username: checkUserinDB.username,
      jobRole: checkUserinDB.jobRole,
      cadreID: checkUserinDB.cadreID,
    });
  }
});

//get users
app.get("/users", async (req, res) => {
  const getUsersfromDB = await client
    .db("capstone")
    .collection("users")
    .find({})
    .toArray();
  getUsersfromDB
    ? res.send(getUsersfromDB)
    : res.status(401).send({ message: "failed to get users data" });
});

app.get("/billabstract", async (req, res) => {
  const getBillAbstract = await client
    .db("capstone")
    .collection("bills")
    .aggregate([
      {
        $group: {
          _id: "$customerName",
          TotalAmount: { $sum: "$NetTotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray();
  res.send(getBillAbstract);
});
