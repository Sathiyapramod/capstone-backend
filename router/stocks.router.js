import { client } from "../index.js";
import express from "express";
import { ObjectId } from "mongodb";

const stocks = express.Router();

stocks.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newQty } = req.body;
  const checkIdInsideDB = await client
    .db("capstone")
    .collection("inventory")
    .findOne({ _id: new ObjectId(id) });
  if (!checkIdInsideDB)
    res.status(401).send({ message: "Invalid Id . Check again" });
  else {
    const updatedInventoryStock = await client
      .db("capstone")
      .collection("inventory")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { totalQty: newQty } });
    console.log(updatedInventoryStock);
  }
});

export default stocks;
