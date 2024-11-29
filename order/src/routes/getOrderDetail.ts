import {
  NotFoundError,
  UnAuthorizedError,
  requireAuth,
  currentUser,
} from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order-model";

const router = express.Router();

router.get(
  "/api/order/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // find order
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as getOrderDetail };
