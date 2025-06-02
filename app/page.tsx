"use client";
import {
  Button,
  Divider,
  Modal,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import { useEffect, useState, createContext, useContext } from "react";
import DonutChart from "react-donut-chart";
import Coder from "./components/Coder";
import { ProblemContext } from "./Context/ProblemContext";
import SidebarButton from "./components/SidebarButton";
import { ProblemType, CoderType } from "./types/types";
import Authentication from "./components/Authentication";
import { LeetCode } from "leetcode-query";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "./contextProvider/userProvider";
import { title } from "process";

export default function Home() {
  const username = useUserContext();
  const [query, setQuery] = useState("");
  const [friendRequestTab, setFriendRequestTab] = useState(false);
  const [pendingRequestTab, setPendingRequestsTab] = useState(false);
  const [deleteRequestTab, setdeleteRequestTab] = useState(false);
  const [coder, setCoder] = useState<CoderType | undefined>(undefined);
  const [problemset, setProblemset] = useState<ProblemType[]>([]);
  const [prompt, setPrompt] = useState("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [friendRequest, setFriendRequest] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    { coder: string; total: number }[]
  >([]);
  const [result, setResult] = useState("");

  const filtered = query
    ? allUsers?.filter(
        (user) =>
          user?.toLowerCase()?.includes(query.toLowerCase()) &&
          user !== username.username
      ) ?? []
    : allUsers?.filter((user) => user !== username.username) ?? [];

  const pendingRequestTabOpen = async () => {
    await getfriendrequests();
    setPendingRequestsTab(true);
  };

  const addFriendModalOpen = async () => {
    setFriendRequestTab(true);
    await getAllUsers();
    console.log();
  };

  const deleteFriendModalOpen = async () => {
    setdeleteRequestTab(true);
    await getAllUsers();
  };

  const pendingRequestTabClose = () => {
    setPendingRequestsTab(false);
  };

  const addFriendModalClose = () => {
    setFriendRequestTab(false);
  };

  const deleteFriendModalClose = () => {
    setdeleteRequestTab(false);
  };

  const getLeetCodeProblems = async () => {
    const res = await fetch("api/leetcode");
    const data = await res.json();
    console.log(data);
  };

  const addFriendApi = async (friend: string) => {
    try {
      const res = await fetch("api/user/sendfriendrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: username.username, to: friend }),
      });
      if (res.ok) {
        await getAllUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addFriend = async (friend: string) => {
    await addFriendApi(friend);
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

  const getfriendrequests = async () => {
    const res = await fetch("api/user/getfreindrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: username.username }),
    });
    const data = await res.json();
    const stuff: string[] = data.data.reduce((acc: string[], request: any) => {
      acc.push(request.username);
      return acc;
    }, []);
    console.log(stuff);
    console.log("friend requests:", data.data);
    if (data.success) {
      setFriendRequest(stuff);
    }
  };

  const getAllUsers = async () => {
    const res = await fetch("api/user/getallusers");
    const allusers = await res.json();
    setAllUsers(allusers.data);
    console.log("allusers", allusers);
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

  const acceptFriendRequest = async (from: string) => {
    try {
      const res = await fetch("api/user/acceptfriendrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username.username, from }),
      });
      if (res.ok) {
        await getfriendrequests();
        await getAllUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectFriendRequest = async (from: string) => {
    try {
      const res = await fetch("api/user/rejectfriendrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, user: username.username }),
      });
      if (res.ok) {
        await getfriendrequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFriend = async (friend: string) => {
    try {
      const res = await fetch("api/user/deletefriend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username.username, friend }),
      });
      if (res.ok) {
        await getAllUsers();
      }
    } catch (error) {
      console.error(error);
    }
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
          <Grid alignContent="center" padding={5} container spacing={10}>
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
              onClick={addFriendModalOpen}
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
              onClick={pendingRequestTabOpen}
            >
              Pending Requests
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
              onClick={deleteFriendModalOpen}
            >
              Remove Friend
            </Button>
          </Grid>
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
              <Modal open={friendRequestTab} onClose={addFriendModalClose}>
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
                    Add a Friend
                  </Typography>
                  <TextField
                    name="problemTitle"
                    type="text"
                    placeholder="Search for a user email"
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
                    {filtered?.map((user) => (
                      <ListItem
                        key={`add-friend-${user}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 2,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography>{user}</Typography>
                        <Button
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(90deg,rgb(195, 163, 104) 0%,rgb(171, 152, 83) 50%)",
                            color: "black",
                          }}
                          onClick={() => addFriend(user)}
                        >
                          Add Friend
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Modal>
              <Modal open={pendingRequestTab} onClose={pendingRequestTabClose}>
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
                    Pending Friend Requests
                  </Typography>
                  <List
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {friendRequest?.map((request) => (
                      <ListItem
                        key={request}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 2,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography>{request}</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            sx={{
                              background:
                                "linear-gradient(90deg,rgb(104, 195, 163) 0%,rgb(83, 171, 152) 50%)",
                              color: "black",
                            }}
                            onClick={() => acceptFriendRequest(request)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              background:
                                "linear-gradient(90deg,rgb(195, 104, 104) 0%,rgb(171, 83, 83) 50%)",
                              color: "black",
                            }}
                            onClick={() => rejectFriendRequest(request)}
                          >
                            Decline
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Modal>
              <Modal open={deleteRequestTab} onClose={deleteFriendModalClose}>
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
                    Remove Friends
                  </Typography>
                  <List
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {allUsers?.map((user) => (
                      <ListItem
                        key={`remove-friend-${user}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 2,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography>{user}</Typography>
                        <Button
                          variant="contained"
                          sx={{
                            background:
                              "linear-gradient(90deg,rgb(195, 104, 104) 0%,rgb(171, 83, 83) 50%)",
                            color: "black",
                          }}
                          onClick={() => removeFriend(user)}
                        >
                          Remove
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Modal>
            </Box>
          )}
          {coder && <Coder coder={coder} />}
        </Box>
      </Box>
    </ProblemContext.Provider>
  );
}
