import {
  getBillByid,
  getAllBillData,
  createNewBill,
  deleteBillByid,
  updatePaymentStatusinDB,
  updateStockinDB,
} from "../services/billing.service.js";

export const getBillByNo = async (req, res) => {
  try {
    const { billnumber } = req.params;
    const getBillfromDB = await getBillByid(billnumber);
    getBillfromDB
      ? res.send(getBillfromDB)
      : res.status(401).send({ message: "failed to load billed data" });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllBills = async (req, res) => {
  try {
    const getBilledData = await getAllBillData();
    getBilledData
      ? res.send(getBilledData)
      : res.status(401).send({ message: "failed to load billed Data" });
  } catch (err) {
    throw new Error(err);
  }
};

export const createBill = async (req, res) => {
  try {
    const {
      customerName,
      billMode,
      creditPeriod,
      items,
      date,
      grossTotal,
      gstNumber,
      billingAddress,
      gst,
      NetTotal,
    } = req.body;
    const newBill = await createNewBill(
      customerName,
      billMode,
      creditPeriod,
      items,
      grossTotal,
      gstNumber,
      billingAddress,
      gst,
      NetTotal,
      date,
    );

    // Update Stock in DB
    for (let billItem in items) {
      await updateStockinDB(items, billItem);
    }
    newBill
      ? res.send({
          message: "New Bill Created Successfully",
        })
      : res.status(401).send({ message: "Failed to create new bill" });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const checkIdInsideDB = await getBillByid(id);

    if (!checkIdInsideDB)
      res.status(401).send({ message: "Invalid ID . Try again" });
    else {
      const deleteBillfromDB = await deleteBillByid(id);
      deleteBillfromDB.deletedCount === 1
        ? res.send({ message: "Bill Deleted Successfully" })
        : res.status(401).send({ message: "Failed to delete Bill" });
    }
  } catch (err) {
    throw new Error(err);
  }
};
export const updateBillById = async (req, res) => {
  try {
    //Only payment status will be uploaded as PAID
    // No other alterations will be made on the database stored
    const { id } = req.params;
    const checkIdInsideDB = await getBillByid(id);
    if (!checkIdInsideDB)
      res.status(401).send({ message: "Invalid ID number" });
    else {
      const updateBillInsideDB = await updatePaymentStatusinDB(id);
      updateBillInsideDB.modifiedCount !== 0
        ? res.status({ message: "Bill Status updated Successfully" })
        : res.status(401).send({ message: "Failed to Perform Payment Update" });
    }
  } catch (err) {
    throw new Error(err);
  }
};
