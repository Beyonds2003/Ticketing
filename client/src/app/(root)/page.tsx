import TicketCard from "@/components/card/TicketCard";

export type TicketType = {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
};


const fetchTickets = async () => {
  const res = await fetch("http://ticket-srv:3002/api/ticket", {
    method: "GET",
    cache: "no-cache",
    next: {
      tags: ["tickets"]
    }
  });
  const data = await res.json();
  return data as TicketType[];
};

export default async function Home() {
  const tickets = await fetchTickets();

  console.log(tickets, "ticket");

  return (
    <main className="p-6 bg-white">
      <h1 className="text-2xl font-semibold">Available Tickets</h1>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-6">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              id={ticket.id}
              title={ticket.title}
              price={ticket.price}
              userId={ticket.userId}
              version={ticket.version}
              orderId={ticket.orderId}
            />
          ))
        ) : (
          <h3 className="text-lg font-semibold">No Tickets Exist</h3>
        )}
      </div>
    </main>
  );
}
