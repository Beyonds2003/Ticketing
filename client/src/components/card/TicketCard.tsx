import React from "react";
import { Button } from "../ui/button";
import { TicketType } from "@/app/(root)/page";
import Link from "next/link";

const TicketCard = ({
  id,
  title,
  price,
  userId,
  version,
  orderId,
}: TicketType) => {
  return (
    <article className=" flex flex-col  justify-between p-4 px-6 rounded-lg background_gradient">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col gap-4 mt-1">
        <p className="text-black text-lg font-semibold">{`Starting from $${price}`}</p>
        <Link href={`/ticket/${id}`}>
          <Button>Detail</Button>
        </Link>
      </div>
    </article>
  );
};

export default TicketCard;
