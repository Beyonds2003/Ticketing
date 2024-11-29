import React from "react";
import { headers } from "next/headers";
import ExpireCountDown from "@/components/shared/ExpireCountDown";

type currentUserType = {
  currentUser: {
    id: string;
    email: string;
  };
};

type orderDetaliResponseType = {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: {
    title: string;
    price: number;
    version: number;
  };
  version: number;
}

const getCurrentUser = async (): Promise<currentUserType> => {
  const res = await fetch("http://auth-srv:3001/api/users/currentUser", {
    method: "GET",
    headers: new Headers(headers()),
  });
  const data = await res.json();
  return data as currentUserType;
};


const fetchOrderDetail = async (orderId: string) => {
  const res = await fetch(`http://order-srv:3003/api/order/${orderId}`, {
    method: "GET",
    headers: new Headers(headers())
  })
  const data: orderDetaliResponseType = await res.json()
  return data;
};

const Order = async ({
  params: { orderId },
}: {
  params: { orderId: string };
}) => {

  const [order, user] = await Promise.all([fetchOrderDetail(orderId), getCurrentUser()])

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold ">{`Purchasing ${order.ticket.title}`}</h1>
      <p className="mt-6 text-lg">{`You have ${60} seconds left to order`}</p>
      <ExpireCountDown
        expireAt={order.expiresAt}
        amount={order.ticket.price}
        email={user.currentUser.email}
        orderId={order.id}
      />
    </section>
  );
};

export default Order;
