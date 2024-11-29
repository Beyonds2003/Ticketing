import express, { Request, Response } from "express"
import { Ticket } from "../models/ticket-model"

const router = express.Router()

router.get("/api/ticket", async (req: Request, res: Response) => {

  const ticket = await Ticket.find({ orderId: undefined })

  res.status(200).send(ticket)
})

export { router as getAllTicketRoute }
