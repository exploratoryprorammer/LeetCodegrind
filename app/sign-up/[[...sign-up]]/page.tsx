import { SignUp } from "@clerk/nextjs";
import React from "react";
import Box from "@mui/material/Box";

const page = () => {
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
        <SignUp />
      </Box>
    </Box>
  );
};

export default page;
