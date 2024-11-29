import { NotFoundError, requireAuth, currentUser } from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order-model";

const router = express.Router();

router.get("/api/order", currentUser, requireAuth, async (req: Request, res: Response) => {
  // find the order that is realed to user
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  if (!orders) {
    throw new NotFoundError();
  }

  res.status(200).send(orders);
});

export { router as getAllOrder };
