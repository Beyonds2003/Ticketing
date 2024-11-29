import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  UnAuthorizedError,
  validateRequest,
  currentUser,
} from "@nicole23_package/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket-model";
import { TicketUpdatedPublisher } from "../event/publisher/ticket-updated-publisher";
import { natWrapper } from "../nat-wrapper";

const router = express.Router();

router.put(
  "/api/ticket/:id",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title should not empty."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should not be less than 0."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Check if the ticket is locked by orderId
    if (ticket.orderId) {
      throw new BadRequestError(
        "Cannot update ticket. Ticket is already reserved."
      );
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
      userId: ticket.userId,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRoute };
