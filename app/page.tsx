"use client";
import { Button, Divider, Modal, Typography, Grid, Box } from "@mui/material";
import { useEffect, useState, createContext, useContext } from "react";
import DonutChart from "react-donut-chart";
import Coder from "./components/Coder";
import { ProblemContext } from "./Context/ProblemContext";
import SidebarButton from "./components/SidebarButton";
import { ProblemType, CoderType } from "./types/types";
import Authentication from "./components/Authentication";
import { LeetCode } from "leetcode-query";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [coder, setCoder] = useState<CoderType | undefined>(undefined);
  const [problemset, setProblemset] = useState<ProblemType[]>([]);
  const [prompt, setPrompt] = useState("");
  const [leaderboard, setLeaderboard] = useState<
    { coder: string; total: number }[]
  >([]);
  const [result, setResult] = useState("");
  const username = useUser().user?.primaryEmailAddress?.emailAddress;

  const getLeetCodeProblems = async () => {
    const res = await fetch("api/leetcode");
    const data = await res.json();
    console.log(data);
  };

  const addFriend = async (freind: string) => {
    try {
      const res = await fetch("api/user/sendfriendrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, freind }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const airesponse = async () => {
    setPrompt("List the neetcode 150 problems");
    const res = await fetch("api/ai_features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    console.log(data.res);
    setResult(data.res);
  };

  const setRohan = () => {
    setCoder({ name: "Rohan", goals: 2 });
  };

  const setGerson = () => {
    setCoder({ name: "Gerson", goals: 1 });
  };

  const setBarghav = () => {
    setCoder({ name: "Bhargav", goals: 1 });
  };

  const setHome = () => {
    setCoder(undefined);
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
    setLeaderboard(results);
  };

  useEffect(() => {
    if (!coder) fetchLeaderboard();
  }, [coder]);

  useEffect(() => {
    getLeetCodeProblems();
    console.log(username);
  }, []);

  return (
    <ProblemContext.Provider value={{ problemset, setProblemset }}>
      <Authentication />
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
          <SidebarButton onClick={setGerson} label="Gerson" />
          <SidebarButton onClick={setBarghav} label="Bhargav" />
          <SidebarButton onClick={airesponse} label="AI Response" />
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
                  margin: "auto",
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
              <Grid alignContent="center" padding={10} container spacing={10}>
                <Button
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
                    width: 200,
                  }}
                >
                  Add Friend
                </Button>
                <Button
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
                    width: 200,
                  }}
                >
                  Remove Friend
                </Button>
              </Grid>
            </Box>
          )}
          {coder && <Coder coder={coder} />}
        </Box>
      </Box>
    </ProblemContext.Provider>
  );
}
