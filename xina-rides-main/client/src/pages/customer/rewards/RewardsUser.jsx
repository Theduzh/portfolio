import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Avatar,
    Button,
    IconButton,
    Input,
    TextField,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    ToggleButtonGroup,
    ToggleButton,
    Tab,
} from "@mui/material";
import {
    motion,
    useAnimate,
    usePresence,
    stagger,
    useInView,
    AnimatePresence,
} from "framer-motion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { deepPurple } from "@mui/material/colors";
import { AccessTime, Search } from "@mui/icons-material";
import Ticket from "@mui/icons-material/ConfirmationNumberOutlined";
import Wallet from "@mui/icons-material/AccountBalanceWalletOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LinearProgress, {
    linearProgressClasses,
} from "@mui/material/LinearProgress";
import http from "../../../http";
import { Navbar, NavContainer } from "../../../components";

function RewardsUser() {
    const [rewardsList, setRewardsList] = useState([]);
    const [redeemList, setRedeemList] = useState([]);
    const [UsedRewards, SetUsedRewards] = useState([]);
    const [CardList, setCardList] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [Redeem, setRedeem] = useState("");
    const [value, setValue] = useState("catalog");
    const [RewardsValue, setRewardsValue] = useState("current");
    const [Spinner, setSpinner] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // const [isPresent, safeToRemove] = usePresence();
    // const [scope, animate] = useAnimate();
    // const isInView = useInView(scope);
    const parent = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const child = {
        initial: { y: -20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    function logo(category) {
        if (category === "Holiday") {
            return <CelebrationIcon />;
        } else if (category === "Event") {
            return <EventAvailableIcon />;
        }
    }

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get("/user/profile").then((res) => {
                setUsers(res.data);
            });
        }
    }, []);

    const getCurrentRedeem = (e) => {
        http.get(`userrewards/${users.id}`).then((res) => {
            let tempRewardList = [];
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].Users[0].User_Rewards.Used === false) {
                    tempRewardList.push(res.data[i]);
                }
            }
            setRedeemList(tempRewardList);
            setCardList(tempRewardList);
        });
    };

    const getUsedRedeem = (e) => {
        http.get(`userrewards/${users.id}`).then((res) => {
            let tempRewardList = [];
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].Users[0].User_Rewards.Used !== false) {
                    tempRewardList.push(res.data[i]);
                }
            }
            SetUsedRewards(tempRewardList);
        });
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRewards = () => {
        http.get("/rewards").then((res) => {
            setRewardsList(res.data);
        });
    };

    const searchRewards = () => {
        if (value == "catalog") {
            http.get(`/rewards?search=${search}`).then((res) => {
                setRewardsList(res.data);
            });
        } else {
            http.get(`/userrewards/search/${users.id}/?search=${search}`).then(
                (res) => {
                    let tempRewardList = [];
                    if (RewardsValue === "current") {
                        for (let i = 0; i < res.data.length; i++) {
                            if (
                                res.data[i].Users[0].User_Rewards.Used === false
                            ) {
                                tempRewardList.push(res.data[i]);
                            }
                        }
                    } else {
                        for (let i = 0; i < res.data.length; i++) {
                            if (
                                res.data[i].Users[0].User_Rewards.Used !== false
                            ) {
                                tempRewardList.push(res.data[i]);
                            }
                        }
                    }
                    setRedeemList(tempRewardList);
                    setCardList(tempRewardList);
                }
            );
        }
    };

    useEffect(() => {
        getRewards();
    }, []);

    useEffect(() => {
        if (users) {
            getCurrentRedeem();
            getUsedRedeem();
        }
    }, [users]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };

    //debouncing wrapper
    let onDelayFunc = searchDebounce(searchRewards(), 2000);

    function searchDebounce(fn, d) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, d);
        };
    }

    const onClickSearch = () => {
        searchRewards();
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue == "redeem") {
            getUsedRedeem();
        }
    };

    const handleUsedRewards = () => {
        setCardList(UsedRewards);
        setRewardsValue("used");
    };

    const handleCurrentRewards = () => {
        setCardList(redeemList);
        setRewardsValue("current");
    };

    function onSubmit(e) {
        if (users.xcredit >= Redeem.xcredit) {
            users.xcredit -= Redeem.xcredit;
            console.log(users.xcredit);
            const RewardData = {
                RewardId: Redeem.id,
                UserId: users.id,
                Used: false,
            };
            const UserData = {
                xcredit: users.xcredit,
                xcreditEarned: users.xcreditEarned,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                gender: users.gender,
            };
            http.post("/userrewards/LinkUserReward", RewardData)
                .then((res) => {
                    console.log(res.data);
                })
                .then(getCurrentRedeem());
            http.put(`/user/updateXCredit`, UserData).then((res) => {
                console.log(res.data);
            });
        }
    }

    function XcreditsToNextTier() {
        if (users.xcreditEarned >= 1000) {
            return (
                <Box mt={1}>
                    <Typography variant="body2" color="initial">
                        You've reached Gold tier. Enjoy your rewards!
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        color="inherit"
                        value={100}
                        sx={{
                            borderRadius: 6,
                            height: 8,
                            mt: 1,
                            bgcolor: "lightgrey",
                        }}
                    />
                </Box>
            );
        } else {
            let tiercredit = 500;
            if (users.xcreditEarned >= 500) {
                tiercredit = 1000;
            }
            let num = tiercredit - users.xcreditEarned;
            return (
                <Box>
                    <Typography
                        variant="subtitle2"
                        color="black"
                        fontWeight="medium"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <Typography
                            variant="body1"
                            fontSize="large"
                            color="initial"
                        >
                            {num}
                        </Typography>
                        XCredits more to{" "}
                        {users.xcreditEarned >= 500 ? "Gold" : "Silver"} Tier
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        color="inherit"
                        value={100 - (num / 500) * 100}
                        sx={{
                            borderRadius: 6,
                            height: 8,
                            mt: 1,
                            bgcolor: "lightgrey",
                        }}
                    />
                </Box>
            );
        }
    }

    function renderNone() {
        if (value == "catalog" && rewardsList.length === 0) {
            return (
                <Box sx={{ height: "100vh" }}>
                    <Typography variant="h4" color="initial" mt={3}>
                        No rewards currently
                    </Typography>
                </Box>
            );
        }
        if (value == "redeem" && CardList.length === 0) {
            return (
                <Box sx={{ height: "100vh" }}>
                    <Typography variant="h4" color="initial" mt={3}>
                        No rewards currently
                    </Typography>
                </Box>
            );
        }
    }

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                }}
            >
                <Box px={8} py={4}>
                    <Box px={2}>
                        <Box>
                            <Typography variant="h6" color="initial">
                                How do I earn XCredits?
                            </Typography>
                            <Typography variant="body1" color="initial">
                                Earn 1 XCredits with every dollar spent.
                            </Typography>
                        </Box>
                        <Typography variant="h3" mt={4}>
                            My Rewards
                        </Typography>
                        <Card
                            sx={{
                                bgcolor:
                                    users.xcreditEarned >= 1000
                                        ? "gold"
                                        : users.xcreditEarned >= 500
                                        ? "lightgrey"
                                        : "chocolate",
                                width: "400px",
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                my: 3,
                                borderRadius: "6px",
                            }}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    borderRadius: "8px",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: deepPurple[500],
                                    }}
                                >
                                    <SavingsOutlinedIcon />
                                    <Typography variant="h6">
                                        XCredits
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h5"
                                    color={deepPurple[500]}
                                >
                                    {users.xcredit}
                                </Typography>
                            </Card>
                            <Card
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    p: 2,
                                    color: deepPurple[500],
                                    borderRadius: "8px",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        fontWeight={"medium"}
                                    >
                                        {users.xcreditEarned >= 1000
                                            ? "Gold"
                                            : users.xcreditEarned >= 500
                                            ? "Silver"
                                            : users.xcreditEarned < 500
                                            ? "Bronze"
                                            : ""}
                                    </Typography>
                                    <Link
                                        to={"/membership"}
                                        color={deepPurple[400]}
                                    >
                                        View all tiers →
                                    </Link>
                                </Box>
                                <Box>{XcreditsToNextTier()}</Box>
                                <Typography variant="subtitle1"></Typography>
                            </Card>
                        </Card>
                    </Box>
                    <Box sx={{ px: 2, mt: 4 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "84vw",
                                alignItems: "center",
                            }}
                        >
                            <TabContext value={value}>
                                <TabList
                                    onChange={handleChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                >
                                    <Tab
                                        label="Rewards Catalog"
                                        value="catalog"
                                    />
                                    <Tab label="My Rewards" value="redeem" />
                                </TabList>
                                <TabPanel value="catalog" sx={{ px: 0, mt: 2 }}>
                                    <Box sx={{ display: "flex" }}>
                                        <TextField
                                            sx={{
                                                width: 300,
                                                bgcolor: deepPurple[50],
                                                borderRadius: 1,
                                            }}
                                            label="Search rewards"
                                            inputProps={{ type: "search" }}
                                            value={search}
                                            onChange={onSearchChange}
                                            onKeyDown={onSearchKeyDown}
                                        ></TextField>
                                        <IconButton
                                            color="primary"
                                            sx={{ mt: 1, ml: 1 }}
                                            onClick={onClickSearch}
                                        >
                                            <Search />
                                        </IconButton>
                                    </Box>
                                    {renderNone()}
                                    <Grid
                                        container
                                        mt={1}
                                        justifyContent={"flex-start"}
                                        spacing={4}
                                        width="86vw"
                                    >
                                        {rewardsList.map((rewards, i) => {
                                            return (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={6}
                                                    lg={4}
                                                    key={rewards.id}
                                                >
                                                    <Card
                                                        sx={{
                                                            width: 330,
                                                            bgcolor:
                                                                deepPurple[50],
                                                        }}
                                                    >
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar
                                                                    sx={{
                                                                        bgcolor:
                                                                            deepPurple[300],
                                                                    }}
                                                                    aria-label="recipe"
                                                                >
                                                                    {logo(
                                                                        rewards.category
                                                                    )}
                                                                </Avatar>
                                                            }
                                                            title={
                                                                rewards.header
                                                            }
                                                            subheader={
                                                                rewards.category
                                                            }
                                                        />
                                                        <CardMedia
                                                            sx={{ height: 200 }}
                                                            component="img"
                                                            image={
                                                                rewards.imageFile
                                                                    ? `http://localhost:3001/uploads/${rewards.imageFile}`
                                                                    : "../uploads/card.png" //default pic
                                                            }
                                                            alt={rewards.haeder}
                                                        />
                                                        <CardContent>
                                                            <Typography
                                                                variant="body1"
                                                                color="text.primary"
                                                            >
                                                                {rewards.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ my: 1 }}
                                                            >
                                                                {
                                                                    rewards.titleSubhead
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ pb: 2 }}
                                                            >
                                                                {
                                                                    rewards.description
                                                                }
                                                            </Typography>
                                                            <Tooltip
                                                                title={
                                                                    users.xcredit <
                                                                    rewards.xcredit
                                                                        ? "Not enough XCredits!"
                                                                        : redeemList.find(
                                                                              (
                                                                                  reward
                                                                              ) =>
                                                                                  reward.id ===
                                                                                  rewards.id
                                                                          ) !=
                                                                          undefined
                                                                        ? "Reward already redeemed. Use rewards before redeeming another"
                                                                        : ""
                                                                }
                                                                placement="right"
                                                            >
                                                                <span>
                                                                    <Button
                                                                        disabled={
                                                                            users.xcredit <=
                                                                            rewards.xcredit
                                                                                ? true
                                                                                : redeemList.find(
                                                                                      (
                                                                                          reward
                                                                                      ) =>
                                                                                          reward.id ===
                                                                                          rewards.id
                                                                                  ) !=
                                                                                  undefined
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        color="secondary"
                                                                        variant="contained"
                                                                        onClick={function (
                                                                            event
                                                                        ) {
                                                                            handleDialogOpen();
                                                                            setRedeem(
                                                                                rewards
                                                                            );
                                                                        }}
                                                                    >
                                                                        Redeem
                                                                    </Button>
                                                                </span>
                                                            </Tooltip>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </TabPanel>
                                <TabPanel value="redeem" sx={{ px: 0, mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "flex-start",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                sx={{
                                                    width: 300,
                                                    bgcolor: deepPurple[50],
                                                    borderRadius: 1,
                                                }}
                                                label="Search rewards"
                                                inputProps={{ type: "search" }}
                                                value={search}
                                                onChange={onSearchChange}
                                                onKeyDown={onSearchKeyDown}
                                            ></TextField>
                                            <IconButton
                                                color="primary"
                                                sx={{ mt: 1, ml: 1 }}
                                                onClick={onClickSearch}
                                            >
                                                <Search />
                                            </IconButton>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            color={
                                                RewardsValue === "used"
                                                    ? "secondary"
                                                    : "inherit"
                                            }
                                            sx={{ height: 40 }}
                                            onClick={
                                                RewardsValue === "used"
                                                    ? handleCurrentRewards
                                                    : handleUsedRewards
                                            }
                                        >
                                            {RewardsValue === "used"
                                                ? "Current Rewards"
                                                : "Used Rewards"}
                                        </Button>
                                    </Box>
                                    {renderNone()}
                                    <Grid
                                        container
                                        mt={1}
                                        spacing={4}
                                        justifyContent={"flex-start"}
                                        width="86vw"
                                    >
                                        {CardList.map((rewards) => {
                                            return (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={6}
                                                    lg={4}
                                                    key={rewards.id}
                                                >
                                                    <motion.div
                                                        layoutId={rewards.id}
                                                        onClick={() =>
                                                            setSelectedId(
                                                                rewards.id
                                                            )
                                                        }
                                                    >
                                                        <Card
                                                            sx={{
                                                                width: 330,
                                                                bgcolor:
                                                                    RewardsValue ===
                                                                    "current"
                                                                        ? deepPurple[50]
                                                                        : "lightgrey",
                                                            }}
                                                        >
                                                            <CardHeader
                                                                avatar={
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor:
                                                                                RewardsValue ===
                                                                                "current"
                                                                                    ? deepPurple[300]
                                                                                    : "lightgrey",
                                                                        }}
                                                                    >
                                                                        {logo(
                                                                            rewards.category
                                                                        )}
                                                                    </Avatar>
                                                                }
                                                                title={
                                                                    rewards.header
                                                                }
                                                                subheader={
                                                                    rewards.category
                                                                }
                                                            />
                                                            <CardMedia
                                                                sx={{
                                                                    height: 200,
                                                                }}
                                                                style={{
                                                                    opacity:
                                                                        RewardsValue ===
                                                                        "current"
                                                                            ? 1
                                                                            : 0.5,
                                                                }}
                                                                component="img"
                                                                image={
                                                                    rewards.imageFile
                                                                        ? `http://localhost:3001/uploads/${rewards.imageFile}`
                                                                        : "../uploads/card.png" //default pic
                                                                }
                                                                alt={
                                                                    rewards.haeder
                                                                }
                                                            />
                                                            <CardContent>
                                                                <Typography
                                                                    variant="body1"
                                                                    color="text.primary"
                                                                >
                                                                    {
                                                                        rewards.title
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        my: 1,
                                                                    }}
                                                                >
                                                                    {
                                                                        rewards.titleSubhead
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        pb: 2,
                                                                    }}
                                                                >
                                                                    {
                                                                        rewards.description
                                                                    }
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                    {/* <AnimatePresence>
                                                        {selectedId && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    opacity: 1,
                                                                }}
                                                            >
                                                                <Card>
                                                                    <CardHeader>
                                                                        test
                                                                    </CardHeader>
                                                                </Card>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence> */}
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Box>
                </Box>
                <Dialog open={dialogOpen} onClose={handleClose}>
                    <DialogTitle>Redeem rewards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="h5">
                                {Redeem.title} ({parseInt(Redeem.discount)}%
                                Off)
                            </Typography>
                            <Typography mt={2}>
                                Redeem this reward for {Redeem.xcredit}{" "}
                                XCredits?
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, px: 2 }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            // onSubmit={function (e) {
                            //     onSubmit(e);
                            // }}
                            onClick={function (e) {
                                onSubmit(e);
                                handleClose();
                            }}
                        >
                            Redeem
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default RewardsUser;
