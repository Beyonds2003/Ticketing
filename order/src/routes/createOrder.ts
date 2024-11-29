import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket-model";
import { Order } from "../models/order-model";
import { OrderCreatedPublisher } from "../events/publishers/order_created_publisher";
import { natWrapper } from "../nat-wrapper";
import { currentUser, requireAuth } from "@nicole23_package/common";

const router = express.Router();

const EXPIRE_WINDOW = 60; // 60 seconds

router.post(
  "/api/order",
  currentUser,
  requireAuth,
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("Valid ticket Id require"),
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    console.log(ticketId, "Ticket")
    if (!ticket) {
      throw new NotFoundError();
    }

    // Find the order that status is not cancelled
    const isResolved = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if (isResolved) {
      throw new BadRequestError("Order is already reserved.");
    }

    // set expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRE_WINDOW);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    // publish and order created event
    await new OrderCreatedPublisher(natWrapper.client).publish({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      version: order.version,
      userId: order.userId,
    });

    res.status(201).send(order);
  }
);

export { router as createOrder };
