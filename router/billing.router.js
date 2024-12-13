import express from "express";
import auth from "../middleware/auth.js";
import {
  createBill,
  deleteBill,
  getAllBills,
  getBillByNo,
  updateBillById,
} from "../controller/billing.controller.js";

const billing = express.Router();

//Updating and Deleting bills disabled as of now.
//Only Manager/Admin level access can be provided for doing the same

//GET all billed data
billing.get("/", auth, getAllBills);

//GET Bill by id
billing.get("/:billnumber", auth, getBillByNo);

//CREATE new Bill
billing.post("/", auth, createBill);

//DELETE a bill
billing.delete("/:id", auth, deleteBill);

//UPDATE a bill for setting payment status
billing.put("/:id", auth, updateBillById);

export default billing;
