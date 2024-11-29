import { headers } from 'next/headers'
import React from 'react'

type userOrderResponseType = {
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
}[]

const getUserOrder = async (): Promise<userOrderResponseType> => {
  const res = await fetch('http://order-srv:3003/api/order', {
    method: "GET",
    headers: new Headers(headers()),
    cache: "no-cache",
  })
  const data = await res.json()
  return data
}

const page = async () => {

  const orders = await getUserOrder()

  console.log(orders, "Orders")

  return (
    <main className='px-8'>
      <h5>List Of Orders:</h5>
      <div className="mt-4 space-y-4">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className='space-y-1 bg-yellow-50 p-4 rounded-lg'>
                <h6>Ticket Title: {order.ticket.title}</h6>
                <p className='flex flex-row gap-4 items-center'>Order Status:
                  <p className={`px-2 py-1 rounded-lg ${order.status === "complete" ? "bg-green-400" : "bg-red-500"}`}>{order.status}</p>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No order exit</p>
        )}
      </div>
    </main>
  )
}

export default page
