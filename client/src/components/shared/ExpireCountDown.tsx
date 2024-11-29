"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

type Props = {
  expireAt: Date;
  amount: number;
  email: string;
  orderId: string;
};

const ExpireCountDown = ({ expireAt, amount, email, orderId }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const findTimeLeft = () => {
      const time = new Date(expireAt).getTime() - new Date().getTime();
      const secondsLeft = Math.round(time / 1000);
      setTimeLeft(secondsLeft > 0 ? secondsLeft : 0); // Prevent negative values
    };

    findTimeLeft();
    const timeInterval = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleToken = async (token: string) => {
    try {
      const data = await axios.post("/api/payment", { orderId, token });

      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (timeLeft < 0) return <p>Order Expired</p>;

  return (
    <div>
      <p>{`Order gonna be expire in ${timeLeft}`}</p>
      <div>
        <StripeCheckout
          token={(token) => handleToken(token.id)}
          stripeKey={process.env.STRIPE_PUBLISH_KEY || ""}
          amount={amount * 100}
          currency="USD"
          email={email}
        />
      </div>
      {error.length > 0 && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ExpireCountDown;
