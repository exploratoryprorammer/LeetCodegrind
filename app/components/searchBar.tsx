import React, { useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { CoderType } from "../types/types";

const searchBar = ({coder, opened}: {coder: CoderType, opened: boolean}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string[]>([])
  const [query, setQuery] = useState<string>

  const getAllLeetCodeProblems = async () => {
    const res = await fetch("api/leetcode");
    const data = await res.json();
    setData(data.titles || [])
  };

  if (opened) {
    getAllLeetCodeProblems()
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(query)
  })

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 350,
      }}
    >
      <Typography variant="h6" mb={2}>
        Add a L**tCode Problem
      </Typography>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const problemTitle = formData.get("problemTitle") as string;
          await addProblem(problemTitle);
          handleClose();
        }}
      >
        <input
          name="problemTitle"
          type="text"
          placeholder="Search for Problem"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          required
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const list = (data: [any]) => {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

export default searchBar;
