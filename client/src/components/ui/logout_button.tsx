"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const LogoutButton = () => {

  const router = useRouter()

  return (
    <button onClick={async () => {
      const res = await fetch(`/api/users/signout`, {
        method: "GET"
      })
      const data = await res.json()
      console.log("Logout:", data)
      if (res.status === 200) {
        router.refresh()
      }
    }}>
      <p className="text-xl cursor-pointer">Sign Out</p>
    </button>
  )
}

export default LogoutButton
