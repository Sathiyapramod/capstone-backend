import express from "express";
import { client } from "../index.js";
import { ObjectId } from "mongodb";
const customers = express.Router();

//CREATE customer

customers.post("/", async (req, res) => {
  const { customerName, contactNo, address, gstNumber } = req.body;

  if (
    customerName == "" ||
    customerName == null ||
    contactNo == "" ||
    contactNo == null ||
    address == "" ||
    address == null ||
    gstNumber == "" ||
    gstNumber == null
  )
    res.status(401).send({ message: "Invalid inputs" });
  else {
    const newCustomer = await client
      .db("capstone")
      .collection("customers")
      .insertOne({
        customerName,
        contactNo,
        address,
        gstNumber,
      });
    newCustomer
      ? res.send({ message: "New customer created successfully" })
      : res.status(401).send({ message: "Failed to create customer" });
  }
});

//READ customers

customers.get("/", async (req, res) => {
  const getCustomers = await client
    .db("capstone")
    .collection("customers")
    .find({})
    .toArray();
  getCustomers
    ? res.send(getCustomers)
    : res.status(401).send({ message: "Failed to load customers" });
});

customers.get("/:id", async (req, res) => {
  const { id } = req.params;

  const checkIdInsideDB = await client
    .db("capstone")
    .collection("customers")
    .findOne({ _id: new ObjectId(id) });

  checkIdInsideDB
    ? res.send(checkIdInsideDB)
    : res.status(401).send({ message: "failed to load customer data" });
});

customers.put("/:id", async (req, res) => {
  //assumed only customer address can be changed
  const { id } = req.params;
  const { address } = req.body;
  const checkIdInsideDB = await client
    .db("capstone")
    .collection("customers")
    .findOne({ _id: new ObjectId(id) });

  if (!checkIdInsideDB) res.status(401).send({ message: "invalid Id" });
  else {
    const updatedCustomer = await client
      .db("capstone")
      .collection("customers")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { address: address } }
      );
    console.log(updatedCustomer);
    updatedCustomer
      ? res.send({ message: "data updated successfully" })
      : res.status(401).send({ message: "failed to update data" });
  }
});

customers.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const checkIdInsideDB = await client
    .db("capstone")
    .collection("customers")
    .findOne({ _id: new ObjectId(id) });
  if (!checkIdInsideDB) res.status(401).send({ message: "invalid Id" });
  else {
    const deleteCustomer = await client
      .db("capstone")
      .collection("customers")
      .deleteOne({ _id: new ObjectId(id) });
    (deleteCustomer.deletedCount == 1 ) ? res.send({message:"Customer deleted successfully"}) : res.status(401).send({message:"failed to delete customer "})
  }
});


export default customers;
