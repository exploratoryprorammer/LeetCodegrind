import {
  Box,
  Divider,
  Typography,
  Grid,
  Button,
  Modal,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import DonutChart from "react-donut-chart";
import { createContext, useState } from "react";
import { useContext } from "react";
import { ProblemContext } from "../Context/ProblemContext";
import { ProblemType, CoderType } from "../types/types";

const Coder = ({ coder }: { coder: CoderType }) => {
  const { problemset, setProblemset } = useContext(ProblemContext) || {};
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [today, setToday] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const getAllLeetCodeProblems = async () => {
    const res = await fetch("api/leetcode");
    const data = await res.json();
    setData(data.titles || []);
  };

  const filteredall = data.filter((title) => title.toLowerCase());

  const filtered = query
    ? data.filter((title) => title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const getproblems = async () => {
    if (!coder) return;
    const res = await fetch("/api/problem/getproblems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coder: coder.name }),
    });
    const data = await res.json();
    if (setProblemset) {
      setProblemset(data.problems);
    }
  };

  const addProblem = async (Problem: string) => {
    if (coder) {
      const res = await fetch("/api/problem/addproblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coder: coder.name, title: Problem }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("added", Problem, coder);
      }
      getproblems();
    }
  };

  const setcharts = async () => {
    if (!coder) return;
    const res = await fetch("/api/problem/getproblems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coder: coder.name }),
    });
    const data = await res.json();
    setTotal(data.problems.length);
    const todayStr = new Date().toISOString().slice(0, 10);
    const problemsToday = data.problems.filter(
      (p: ProblemType) =>
        new Date(p.date).toISOString().slice(0, 10) === todayStr
    );
    setToday(problemsToday.length);
  };

  const fetchLeaderboard = async () => {
    const coders = ["Rohan", "Gerson", "Bhargav"];
    const results = await Promise.all(
      coders.map(async (c) => {
        const res = await fetch("/api/problem/getproblems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coder: c }),
        });
        const data = await res.json();
        return { coder: c, total: data.problems.length };
      })
    );
    results.sort((a, b) => b.total - a.total);
  };

  const handleOpen = () => {
    getAllLeetCodeProblems();
    setOpen(true);
  };

  const handleClose = () => {
    setData([]);
    setOpen(false);
  };

  const handleDeleteProblem = () => {
    setDelOpen(true);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };

  useEffect(() => {
    if (delOpen && coder) getproblems();
  }, [delOpen, coder]);

  useEffect(() => {
    setcharts();
  }, [problemset, coder]);

  useEffect(() => {
    if (!coder) fetchLeaderboard();
  }, [coder]);

  return (
    <Box>
      {coder && (
        <Box>
          <Divider sx={{ marginLeft: 0 }}>
            <Typography variant="h4" align="center">
              Hi {coder.name}! Record your L**tCode work and keep your progress
              organized.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <a
                href="https://leetcode.com/problem-list/oizxjoit/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  background: "#ffa116",
                  padding: "8px 18px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  transition: "background 0.2s",
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                Blind 75
              </a>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <a
                href="https://neetcode.io/roadmap"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  background: "#ffa116",
                  padding: "8px 18px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  transition: "background 0.2s",
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                Neetcode 150
              </a>
            </Box>
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
                display: "flex",
                flexDirection: "column",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "95vw", sm: "70vw", md: "40vw" },
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                height: "50%",
                maxHeight: "90vh",
              }}
            >
              <Typography variant="h6" mb={2}>
                Add a L**tCode Problem
              </Typography>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const problemTitle = formData.get("problemTitle") as string;
                  await addProblem(problemTitle);
                  handleClose();
                }}
              >
                <TextField
                  name="problemTitle"
                  type="text"
                  placeholder="Search for Problem"
                  sx={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "16px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    mb: 2,
                  }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <List
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    width: "100%",

                    overflowY: "auto",
                  }}
                >
                  {query.length === 0
                    ? filteredall.map((title) => (
                        <Button
                          sx={{ width: "100%", color: "black" }}
                          key={title}
                        >
                          <ListItem key={title}>{title}</ListItem>
                        </Button>
                      ))
                    : filtered.map((title) => (
                        <Button
                          sx={{ width: "100%", color: "black" }}
                          key={title}
                        >
                          <ListItem key={title}>{title}</ListItem>
                        </Button>
                      ))}
                </List>
                <Box
                  paddingY="-10%"
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                >
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
                width: { xs: "95vw", sm: "70vw", md: "40vw" },
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                minWidth: 350,
              }}
            >
              <Typography variant="h6" mb={2}>
                Delete a L**tCode Problem.
              </Typography>
              <ul style={{ maxHeight: 200, overflowY: "auto", padding: 0 }}>
                {(problemset ?? []).map((p) => (
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
                  value: today,
                },
                {
                  label: "Incomplete",
                  value: Math.max(coder.goals - today, 0),
                },
              ]}
            />

            <DonutChart
              data={[
                {
                  label: "Total Completed",
                  value: total,
                },
                {
                  label: "Incomplete",
                  value: Math.max(150 - total, 0),
                },
              ]}
            />
          </div>
        </Box>
      )}
    </Box>
  );
};

export default Coder;
