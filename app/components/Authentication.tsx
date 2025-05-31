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
import React, { useEffect } from "react";

const Authentication = () => {
  const username = useUser().user?.primaryEmailAddress?.emailAddress;
  console.log("username", username);

  const addUser = async () => {
    const res = await fetch("api/user/adduser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username }),
    });
    const data = await res.json();
    console.log(data);
  };
  const router = useRouter();

  const signin = async () => {
    router.push("/sign-in");
  };

  const signup = async () => {
    router.push("/sign-up");
  };

  useEffect(() => {
    if (username) {
      addUser();
    }
  }, [username]);

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
