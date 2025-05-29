import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

export const AddUserOnAuth = () => {
  const { user } = useUser()
  useEffect(() => {
    if(user) (
        fetch("api/use/adduser"), {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({name: user.username})
        }
    )
  }, [user])
}
