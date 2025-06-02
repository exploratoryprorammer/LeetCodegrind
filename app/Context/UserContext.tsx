import { createContext } from "react";

type userContextType = {
  username: string | null;
  setUsername: (name: string) => void;
};
export const UserContext = createContext<userContextType>(
    {
        username: null,
        setUsername: () => {}
    }
);
