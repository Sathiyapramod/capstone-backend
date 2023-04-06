import { client } from "../index.js";
import express from "express";
import { ObjectId } from "mongodb";

const billing = express.Router();

//Updating and Deleting bills disabled as of now.
//Only Manager/Admin level access can be provided for doing the same

//GET all billed data
billing.get("/", async (req, res) => {
  const getBilledData = await client
    .db("capstone")
    .collection("bills")
    .find({})
    .toArray();
  getBilledData
    ? res.send(getBilledData)
    : res.status(401).send({ message: "failed to load billed Data" });
});

billing.get("/:billnumber", async (req, res) => {
  const { billnumber } = req.params;
  //   console.log(billnumber);
  const getBillfromDB = await client
    .db("capstone")
    .collection("bills")
    .find({ billnumber });
  getBillfromDB
    ? res.send(getBillfromDB)
    : res.status(401).send({ message: "failed to load billed data" });
});

//CREATE new Bill
billing.post("/", async (req, res) => {
  const {
    customerName,
    billMode,
    creditPeriod,
    items,
    date,
    grossTotal,
    gst,
    NetTotal,
  } = req.body;
  const newBill = await client
    .db("capstone")
    .collection("bills")
    .insertOne({
      customerName,
      billMode,
      creditPeriod,
      items,
      grossTotal,
      gst,
      NetTotal,
      date: new Date(date),
    });
  // console.log(newBill);

  console.log(items);

  // Update Stock in DB
  for (let billItem in items) {
    const updateIteminDB = await client
      .db("capstone")
      .collection("inventory")
      .updateOne(
        { name: items[billItem].name },
        {
          $inc: {
            billedQty: Number(items[billItem].qty),
            availableQty: -Number(items[billItem].qty),
          },
        }
      );
    console.log(updateIteminDB);
  }
  newBill
    ? res.send({
        message: "New Bill Created Successfully",
      })
    : res.status(401).send({ message: "Failed to create new bill" });
});


//DELETE a bill

billing.delete("/:id", async(req,res)=>{
  const {id} = req.params;
  const checkIdInsideDB = await client.db("capstone").collection("bills").findOne({_id: new ObjectId(id)})
  if(!checkIdInsideDB) res.status(401).send({message:"Invalid ID . Try again"})
  else {
    const deleteBillfromDB = await client.db("capstone").collection("bills").deleteOne({_id : new ObjectId(id)});
    deleteBillfromDB.deletedCount == 1 ? res.send({message:"Bill Deleted Successfully"}) : res.status(401).send({message:"Failed to delete Bill"})
  }
})

export default billing;
