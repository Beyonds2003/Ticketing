import Link from "next/link";
import React from "react";
import { cookies, headers } from "next/headers";
import LogoutButton from "../ui/logout_button";

type currentUserType = {
  currentUser: {
    id: string;
    email: string;
  };
};

const getCurrentUser = async (): Promise<currentUserType> => {
  const res = await fetch("http://auth-srv:3001/api/users/currentUser", {
    method: "GET",
    headers: new Headers(headers()),
  });
  const data = await res.json();
  return data as currentUserType;
};

const Header = async () => {


  const { currentUser } = await getCurrentUser();


  return (
    <nav className="h-16 bg-milk flex items-center justify-between p-8">
      <Link href="/">
        <h1 className="text-3xl font-bold cursor-pointer">Ticking</h1>
      </Link>
      {!currentUser ? (
        <div className="flex items-center gap-12">
          <Link href="/signup">
            <p className="text-xl cursor-pointer">Sign Up</p>
          </Link>
          <Link href="/signin">
            <p className="text-xl cursor-pointer">Sign In</p>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-12">
          <Link href="/order">
            <p className="text-xl cursor-pointer">My Orders</p>
          </Link>
          <Link href="/ticket">
            <p className="text-xl cursor-pointer">Sell Tickets</p>
          </Link>
          <LogoutButton />
        </div>
      )}
    </nav>
  );
};

export default Header;
