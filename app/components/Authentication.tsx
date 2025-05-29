import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Authentication = () => {
  const router = useRouter();

  const signin = () => {
    router.push("/sign-in");
  };

  const signup = () => {
    router.push("/sign-up");
  };

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
