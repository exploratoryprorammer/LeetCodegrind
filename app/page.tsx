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
  type Problem = { _id: string; coder: string; title: string; date: string };
  const [problems, setProblems] = useState<Problem[]>([]);
  const [today, setToday] = useState(0);
  const [total, setTotal] = useState(0);
  const [leaderboard, setLeaderboard] = useState<
    { coder: string; total: number }[]
  >([]);

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
      (p: Problem) => new Date(p.date).toISOString().slice(0, 10) === todayStr
    );
    setToday(problemsToday.length);
  };

  const setRohan = () => {
    setCoder("Rohan");
  };

  const setGerson = () => {
    setCoder("Gerson");
  };

  const setBarghav = () => {
    setCoder("Bhargav");
  };

  const setHome = () => {
    setCoder("");
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
      const res = await fetch("/api/addproblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coder, title: Problem }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("added", Problem, coder);
      }
      getproblems();
    }
  };

  const fetchLeaderboard = async () => {
    const coders = ["Rohan", "Gerson", "Bhargav"];
    const results = await Promise.all(
      coders.map(async (c) => {
        const res = await fetch("/api/getproblems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coder: c }),
        });
        const data = await res.json();
        return { coder: c, total: data.problems.length };
      })
    );
    results.sort((a, b) => b.total - a.total);
    setLeaderboard(results);
  };

  useEffect(() => {
    if (delOpen && coder) getproblems();
  }, [delOpen, coder]);

  useEffect(() => {
    setcharts();
  }, [problems, coder]);

  useEffect(() => {
    if (!coder) fetchLeaderboard();
  }, [coder]);

  return (
    <Divider
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f7efd2",
      }}
    >
      <Grid container spacing={10}>
        <Box padding={5}>
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: 22, padding: "16px" }}
            onClick={setHome}
          >
            Home
          </Button>
        </Box>
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
        <Box padding={5}>
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: 22, padding: "16px" }}
            onClick={setBarghav}
          >
            Bhargav
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
          <>
            <h1
              style={{ fontWeight: 700, fontSize: "2.2rem", marginBottom: 24 }}
            >
              Welcome! Select your name below to start tracking your LeetCode
              progress for Summer 2025.
            </h1>
            <Box
              mt={4}
              sx={{
                background: "#fffbe6",
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                padding: 4,
                minWidth: 340,
                maxWidth: 420,
                margin: "0 auto",
                border: "2px solid #f7efd2",
              }}
            >
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "#b8860b",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                🏆 Leaderboard
              </Typography>
              <ol style={{ fontSize: 22, paddingLeft: 24, margin: 0 }}>
                {leaderboard.map((entry, idx) => (
                  <li
                    key={entry.coder}
                    style={{
                      marginBottom: 12,
                      fontWeight: idx === 0 ? 700 : 500,
                      color: idx === 0 ? "#228B22" : "#444",
                      background: idx === 0 ? "#e6ffe6" : "transparent",
                      borderRadius: 6,
                      padding: idx === 0 ? "6px 12px" : "0",
                    }}
                  >
                    <span style={{ marginRight: 8 }}>
                      {idx === 0
                        ? "🥇"
                        : idx === 1
                        ? "🥈"
                        : idx === 2
                        ? "🥉"
                        : ""}
                    </span>
                    {entry.coder}:{" "}
                    <span style={{ color: "#b8860b" }}>{entry.total}</span>{" "}
                    problems solved
                  </li>
                ))}
              </ol>
            </Box>
          </>
        )}
        {coder == "Rohan" && (
          <div>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Record your LeetCode work and keep your progress
                organized.
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
                    value: today,
                  },
                  {
                    label: "Incomplete",
                    value: Math.max(1 - today, 0),
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
          </div>
        )}
        {coder == "Gerson" && (
          <div>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Add your LeetCode problems and review your daily
                stats.
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
                    value: today,
                  },
                  {
                    label: "Incomplete",
                    value: Math.max(1 - today, 0),
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
                    value: Math.max(100 - total, 0),
                  },
                ]}
              />
            </div>
          </div>
        )}
        {coder == "Bhargav" && (
          <div>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Log your LeetCode activity and monitor your results
                here.
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
                    value: today,
                  },
                  {
                    label: "Incomplete",
                    value: Math.max(1 - today, 0),
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
                    value: Math.max(100 - total, 0),
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
