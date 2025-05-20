"use client";
import { Button, Divider, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import DonutChart from "react-donut-chart";

export default function Home() {
  const [coder, setCoder] = useState("");
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  type Problem = { _id: string; title: string; date: string };
  const [problems, setProblems] = useState<Problem[]>([]);
  const [today, setToday] = useState(0);
  const [total, setTotal] = useState(0);

  const getproblems = async () => {
    if (!coder) return;
    const res = await fetch("/api/getproblems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coder }),
    });
    const data = await res.json();
    setProblems(data.problems);
  };

  const setcharts = async () => {
    if (!coder) return;
    const res = await fetch("/api/getproblems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coder }),
    });
    const data = await res.json();
    setTotal(data.problems.length);
    const todayStr = new Date().toISOString().slice(0, 10);
    const problemsToday = data.problems.filter(
      (p: string) => new Date(p.date).toISOString().slice(0, 10) === todayStr
    );
    setToday(problemsToday.length);
  };

  const setRohan = () => {
    setCoder("Rohan");
  };

  const setGerson = () => {
    setCoder("Gerson");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProblem = () => {
    setDelOpen(true);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };

  const addProblem = async (Problem: string) => {
    if (coder) {
      const res = await fetch("api/addproblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coder, title: Problem }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("added", Problem, coder);
      }
      getproblems()
    }
  };

  useEffect(() => {
    if (delOpen && coder) getproblems();
  }, [delOpen, coder]);

  useEffect(() => {
    setcharts();
  }, [problems, coder]);

  return (
    <Divider
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f7efd2",
      }}
    >
      <Grid container spacing={40}>
        <Box padding={5}>
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: 22, padding: "16px" }}
            onClick={setRohan}
          >
            Rohan
          </Button>
        </Box>
        <Box padding={5}>
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: 22, padding: "16px" }}
            onClick={setGerson}
          >
            Gerson
          </Button>
        </Box>
      </Grid>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        {!coder && (
          <h1>
            Click the button corresponding to your name to track you Leetcode
            problems for the Summer of 2025
          </h1>
        )}
        {(coder == "Rohan" || coder == "Gerson") && (
          <div>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hey {coder}! Use the tools to start logging your Leet Code questions and achievements.

              </Typography>
              <Grid padding={10} marginLeft={20} container spacing={10}>
                <Button variant="contained" onClick={handleOpen}>
                  <h1>Add Problem</h1>
                </Button>
                <Button variant="contained" onClick={handleDeleteProblem}>
                  <h1>Delete Problem</h1>
                </Button>
              </Grid>
            </Divider>

            <Modal open={open} onClose={handleClose}>
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
                  Add a LeetCode Problem
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
                    placeholder="Enter problem title"
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
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      Add
                    </Button>
                  </Box>
                </form>
              </Box>
            </Modal>
            <Modal open={delOpen} onClose={handleDelClose}>
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
                  Delete a LeetCode Problem.
                </Typography>
                <ul style={{ maxHeight: 200, overflowY: "auto", padding: 0 }}>
                  {problems.map((p) => (
                    <li
                      key={p._id}
                      style={{ marginBottom: 8, listStyle: "none" }}
                    >
                      <span>{p.title}</span>
                      <Button
                        onClick={async () => {
                          await fetch("/api/deleteproblem", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: p._id }),
                          });
                          getproblems();
                        }}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </Box>
            </Modal>
            <div>
              <DonutChart
                data={[
                  {
                    label: "Completed Today",
                    value: Math.min(Math.round((total / 3) * 100), 100),
                  },
                  {
                    label: "Incomplete",
                    value: Math.min(Math.round(100 - (total / 3) * 100), 100),
                  },
                ]}
              />

              <DonutChart
                data={[
                  {
                    label: "Total Completed",
                    value: Math.min(Math.round((today / 150) * 100), 100),
                  },
                  {
                    label: "Incomplete",
                    value: Math.min(Math.round(100 - (today / 150) * 100), 100),
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Box>
    </Divider>
  );
}
