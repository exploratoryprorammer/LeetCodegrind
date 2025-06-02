'use client'
import { ReactNode, useContext, useState } from "react"
import { UserContext } from "../Context/UserContext"

export function UserProvider({ children}: {children: ReactNode}) {
    const [username, setUsername] = useState<string | null>(null)

    const value = {
        username,
        setUsername
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("user context must be wrapper in the layout.tsx file")

    }
    return context
}