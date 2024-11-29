import TicketPurchaseButton from "@/components/shared/TicketPurchaseButton";
import React from "react";

type TicketDetailType = {
  title: string,
  price: number,
  userId: string,
  version: number,
  id: string
}

const fetchTicketDetail = async (ticketId: string): Promise<TicketDetailType> => {
  const res = await fetch(`http://ticket-srv:3002/api/ticket/${ticketId}`, {
    method: "GET",
    cache: "no-cache"
  });
  const data = await res.json();
  return data;
};

const Ticket = async ({
  params: { ticketId },
}: {
  params: { ticketId: string };
}) => {
  const ticket = await fetchTicketDetail(ticketId);

  console.log("Ticket Detail: ", ticket);

  return (
    <section className="text-black p-6">
      <article className="w-[400px] rounded-lg overflow-hidden border-[1px] border-black">
        <h1 className="text-xl font-semibold background_gradient p-4">
          {ticket.title}
        </h1>
        <div className="flex flex-col gap-3 p-4 text-lg">
          <p>{`Price - $${ticket.price}`}</p>
          <p>Status - Available</p>
          <TicketPurchaseButton ticketId={ticketId} />
        </div>
      </article>
    </section>
  );
};

export default Ticket;
