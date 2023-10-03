import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Card,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import { Navbar, SideNav, StatisticCard } from "../../components";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import http from "../../http";
import global from "../../global";
import dayjs from "dayjs";

function AdminDashboard() {
    const [rewardsList, setRewardsList] = useState([]);
    const [RedeemList, setRedeemList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const open = Boolean(anchorEl);
    const [Users, setUsers] = useState([]);
    const [bikes, setBikes] = useState([]);

    const getRewards = () => {
        http.get("/rewards").then((res) => {
            setRewardsList(res.data);
        });
    };

    const getUsers = () => {
        http.get("/user/accounts").then((res) => {
            setUsers(res.data);
        });
    };

    const getBikes = () => {
        http.get("/bike").then((res) => {
            setBikes(res.data);
        });
    };

    const getRedeem = () => {
        http.get("/userrewards").then((res) => {
            setRedeemList(res.data);
        });
    };

    useEffect(() => {
        getRewards();
        getUsers();
        getBikes();
        getRedeem();
    }, []);

    const data = [];
    const dateDict = {};
    const redeemDict = {};
    for (let i = 5; i > 0; i--) {
        let newDate = new Date();
        dateDict[
            dayjs(newDate.setDate(newDate.getDate() - i)).format(
                global.dateFormat
            )
        ] = 0;
        newDate = new Date();
        redeemDict[
            dayjs(newDate.setDate(newDate.getDate() - i)).format(
                global.dateFormat
            )
        ] = 0;
    }

    console.log(redeemDict);
    for (let i = 0; i < rewardsList.length; i++) {
        if (
            dayjs(rewardsList[i].createdAt).format(global.dateFormat) in
            dateDict
        ) {
            dateDict[
                dayjs(rewardsList[i].createdAt).format(global.dateFormat)
            ] += 1;
        }
    }

    for (let i = 0; i < RedeemList.length; i++) {
        if (
            dayjs(RedeemList[i].createdAt).format(global.dateFormat) in
            redeemDict
        ) {
            redeemDict[
                dayjs(RedeemList[i].createdAt).format(global.dateFormat)
            ] += 1;
        }
    }

    for (var j in dateDict) {
        data.push({
            date: j,
            rewards: dateDict[j],
            redeem: redeemDict[j],
        });
    }
    const renderRewardsLineChart = () => {
        return (
            <ResponsiveContainer width="95%" height={290}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 0, bottom: 0, left: -30 }}
                >
                    <Line
                        type="monotone"
                        dataKey="rewards"
                        stroke="#8884d8"
                        name="Rewards Created"
                    />
                    <Line
                        type="monotone"
                        dataKey="redeem"
                        stroke="#82ca9d"
                        name="Redeemed"
                        activeDot={{ r: 6 }}
                    />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if (index == 0) {
            http.get("/rewards").then((res) => {
                setRewardsList(res.data);
            });
        } else {
            http.get(`/rewards?search=${options[index]}`).then((res) => {
                setRewardsList(res.data);
            });
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const options = ["Last updated", "Event", "Holiday"];

    return (
        <Box sx={{ overflowY: "hidden" }}>
            <Navbar />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box
                    sx={{
                        p: 7.5,
                        width: "100%",
                        minHeight: "100vh",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h4" fontSize={36}>
                        Dashboard
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatisticCard
                                title="Total Users"
                                value={Users.length}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatisticCard
                                title="Active Rentals"
                                value={
                                    bikes.filter((b) => b.currentlyInUse).length
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatisticCard
                                title="Active Rewards"
                                value={rewardsList.length}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatisticCard
                                title="Total Bikes"
                                value={bikes.length}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", width: "100%", gap: 2, mt: 2 }}>
                        <Box sx={{ width: "100%" }}>
                            <Card sx={{ p: 2 }}>
                                <Typography
                                    variant="p"
                                    fontSize={16}
                                    fontWeight="medium"
                                    m={1}
                                >
                                    Rewards
                                </Typography>
                                {renderRewardsLineChart()}
                            </Card>
                        </Box>
                        <Box sx={{ width: "100%" }}>
                            <Card sx={{ p: 2 }}>
                                <Typography
                                    variant="p"
                                    fontSize={16}
                                    fontWeight="medium"
                                    m={1}
                                >
                                    Rewards
                                </Typography>
                                {renderRewardsLineChart()}
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminDashboard;
