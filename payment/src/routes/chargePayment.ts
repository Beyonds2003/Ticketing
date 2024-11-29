import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
  requireAuth,
  validateRequest,
  currentUser,
} from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order-model";
import { stripe } from "../stripe";
import { Payment } from "../models/payment-model";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natWrapper } from "../nat-wrapper";

const router = express.Router();

router.post(
  "/api/payment",
  currentUser,
  requireAuth,
  [body("orderId").not().isEmpty(), body("token").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id!) {
      throw new UnAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for cancelled order");
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });

    await payment.save();

    // publish payment create event
    await new PaymentCreatedPublisher(natWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send(payment);
  }
);

export { router as chargePayment };
