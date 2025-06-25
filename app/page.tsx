"use client";
import { Button, Divider, Modal, Typography, Grid, Box } from "@mui/material";
import { useEffect, useState } from "react";
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

  const setMathew = () => {
    setCoder("Mathew");
  };

  const setRohan = () => {
    setCoder("Rohan");
  };

  const setGerson = () => {
    setCoder("Gerson");
  };

  const setFranck = () => {
    setCoder("Franck");
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
    const coders = ["Rohan", "Gerson", "Franck", "Mathew"];
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f7efd2",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: 90, sm: 140 },
          minWidth: { xs: 90, sm: 140 },
          background: "#f7efd2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pl: 3,
          py: 4,
          zIndex: 2,
          gap: 2,
        }}
      >
        <SidebarButton onClick={setHome} label="Home" />
        <SidebarButton onClick={setRohan} label="Rohan" />
        <SidebarButton onClick={setMathew} label="Mathew" />
        <SidebarButton onClick={setGerson} label="Gerson" />
        <SidebarButton onClick={setFranck} label="Franck" />
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100vh",
          px: { xs: 2, sm: 6 },
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!coder && (
          <Box>
            <h1
              style={{
                fontWeight: 700,
                fontSize: "2.2rem",
                marginBottom: 24,
                textAlign: "center",
                maxWidth: 500,
                lineHeight: 1.2,
              }}
            >
              Welcome! Select your name below to start tracking your L**tCode
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
                Leaderboard
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
                      padding: "0",
                    }}
                  >
                    {entry.coder}:{" "}
                    <span style={{ color: "#b8860b" }}>{entry.total}</span>{" "}
                    problems solved
                  </li>
                ))}
              </ol>
            </Box>
          </Box>
        )}
        {coder == "Rohan" && (
          <Box>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Record your L**tCode work and keep your progress
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
                  Delete a L**tCode Problem.
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
                    value: Math.max(2 - today, 0),
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
        {coder == "Mathew" && (
          <Box>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Record your L**tCode work and keep your progress
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
                  Delete a L**tCode Problem.
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
                    value: Math.max(2 - today, 0),
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
        {coder == "Gerson" && (
          <Box>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Add your L**tCode problems and review your daily
                stats.
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
                  Delete a L**tCode Problem.
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
          </Box>
        )}
        {coder == "Franck" && (
          <Box>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Log your L**tCode activity and monitor your results
                here.
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
              <Grid padding={10} marginLeft={20} container spacing={2}>
                <Button variant="contained" size="small" onClick={handleOpen}>
                  <h1>Add Problem</h1>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDeleteProblem}
                >
                  <h1>Delete Problem</h1>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDeleteProblem}
                >
                  <h1>Get Problem</h1>
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
                  Delete a L**tCode Problem.
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
                    value: Math.max(2 - today, 0),
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
        {coder == "Tara" && (
          <Box>
            <Divider sx={{ marginLeft: 0 }}>
              <Typography variant="h4" align="center">
                Hi {coder}! Add your L**tCode problems and review your daily
                stats.
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
                  Delete a L**tCode Problem.
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
          </Box>
        )}
      </Box>
    </Box>
  );
}
function SidebarButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={onClick}
      sx={{
        fontSize: 20,
        py: 2,
        borderRadius: 3,
        background:
          "linear-gradient(90deg,rgb(195, 163, 104) 0%,rgb(171, 152, 83) 50%)",
        color: "black",
        fontWeight: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        mb: 1.5,
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
        "&:hover": {
          background:
            "linear-gradient(90deg,rgb(137, 118, 46) 0%, #f7c873 100%)",
          color: "black",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        },
      }}
    >
      {label}
    </Button>
  );
}
