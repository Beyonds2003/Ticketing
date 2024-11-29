import express, { Request, Response } from "express";
import { validateRequest, currentUser, requireAuth } from "@nicole23_package/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket-model";
import { TicketCreatedPublisher } from "../event/publisher/ticket-created-publisher";
import { natWrapper } from "../nat-wrapper";

const router = express.Router();

router.post(
  "/api/ticket",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title should not be emply."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should not be less than zero."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  },
);

export { router as createTicketRoute };
