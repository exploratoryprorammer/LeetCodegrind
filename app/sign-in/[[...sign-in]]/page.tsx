import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";

const signin = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f7efd2",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box mt={20}>
        <SignIn />
      </Box>
    </Box>
  );
};

export default signin;
