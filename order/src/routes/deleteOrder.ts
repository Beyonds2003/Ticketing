import {
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
  requireAuth,
  currentUser,
} from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order-model";
import { OrderCancelledPublisher } from "../events/publishers/order_cancelled_publisher";
import { natWrapper } from "../nat-wrapper";

const router = express.Router();

router.patch(
  "/api/order/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // find order
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    // publish an event
    await new OrderCancelledPublisher(natWrapper.client).publish({
      id: order.id,
      status: order.status,
      ticket: { id: order.ticket.id },
      version: order.version,
      userId: order.userId,
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrder };
