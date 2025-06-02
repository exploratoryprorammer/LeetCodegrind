import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useUserContext } from "../contextProvider/userProvider";

const Authentication = () => {
  const {username, setUsername} = useUserContext();
  const usernamesetter = useUser().user?.primaryEmailAddress?.emailAddress;
  console.log("username", usernamesetter);

  const addUser = async (emailAddress: string) => {
    try {
      const res = await fetch("/api/user/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: emailAddress }),
      });
      if (!res.ok) {
        throw new Error(`Failed to add user: ${res.status}`);
      }
      const data = await res.json();
      console.log("User added successfully:", data);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const router = useRouter();

  const signin = async () => {
    router.push("/sign-in");
  };

  const signup = async () => {
    router.push("/sign-up");
  };

  useEffect(() => {
    if (usernamesetter) {
      setUsername(usernamesetter);
      addUser(usernamesetter);
    }
  }, [usernamesetter, setUsername]);

  return (
    <Toolbar
      sx={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        alignContent: "flex-end",
        width: "100%",
      }}
    >
      <Box sx={{ flexGrow: 2 }} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <SignedOut>
          <Button size="large" variant="contained" onClick={signin}>
            {"Sign In"}
          </Button>
          <Button
            size="large"
            sx={{ bgcolor: "white" }}
            variant="outlined"
            onClick={signup}
          >
            {"Sign Up"}
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "48px",
                  height: "48px",
                },
              },
            }}
          />
        </SignedIn>
      </Box>
    </Toolbar>
  );
};

export default Authentication;
