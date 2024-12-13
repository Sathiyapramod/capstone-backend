import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function getBillByid(billnumber) {
  return await client
    .db("capstone")
    .collection("bills")
    .findOne({ _id: new ObjectId(billnumber) });
}

export async function getAllBillData() {
  return await client.db("capstone").collection("bills").find({}).toArray();
}
export async function createNewBill(
  customerName,
  billMode,
  creditPeriod,
  items,
  grossTotal,
  gst,
  gstNumber,
  billingAddress,
  NetTotal,
  date,
) {
  return await client
    .db("capstone")
    .collection("bills")
    .insertOne({
      customerName,
      billMode,
      creditPeriod,
      items,
      grossTotal,
      gst,
      gstNumber,
      billingAddress,
      NetTotal,
      date: new Date(date),
    });
}
export async function deleteBillByid(id) {
  return await client
    .db("capstone")
    .collection("bills")
    .deleteOne({ _id: new ObjectId(id) });
}
export async function updatePaymentStatusinDB(id) {
  return await client
    .db("capstone")
    .collection("bills")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { billingStatus: "paid" },
      },
    );
}
export async function updateStockinDB(items, billItem) {
  try {
    return await client
      .db("capstone")
      .collection("inventory")
      .updateOne(
        { name: items[billItem].name },
        {
          $inc: {
            billedQty: Number(items[billItem].qty),
            availableQty: -Number(items[billItem].qty),
          },
        },
      );
  } catch (err) {
    throw new Error(err);
  }
}
