"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type orderCreateResponseType = {
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

const TicketPurchaseButton = ({ ticketId }: { ticketId: string }) => {

  const [error, setError] = useState<string>("");
  const router = useRouter()

  const handleTicketPurchase = async () => {
    console.log({ ticketId })
    try {

      const { data, status }: { data: orderCreateResponseType, status: number } = await axios.post(`/api/order`, { ticketId })

      if (status === 201) {
        console.log("Redirect")
        router.push(`/order/${data.id}`)
      }

    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div>
      <Button onClick={handleTicketPurchase} className="w-fit px-8 text-md">Purchase</Button>
      <p className="text-red-500 mt-4 bg-red-200">{error}</p>
    </div>
  )
}

export default TicketPurchaseButton
