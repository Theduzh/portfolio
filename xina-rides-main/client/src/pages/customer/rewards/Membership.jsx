import { Box, Card, Button, Typography, Tab, ButtonGroup } from "@mui/material";
import { Link } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState, useRef, useEffect } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PedalBikeOutlinedIcon from "@mui/icons-material/PedalBikeOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import autoAnimate from "@formkit/auto-animate";
import http from "../../../http";
import { deepPurple } from "@mui/material/colors";

function membership() {
    const [value, setValue] = React.useState("bronze");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const joinProgram = () => {
        if (!localStorage.getItem("accessToken")) {
            return (
                <Box
                    sx={{
                        backgroundImage:
                            "url('../../../src/assets/glassBg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        width: "100%",
                        height: "350px",
                        boxShadow: 1,
                        borderRadius: 4,
                    }}
                >
                    <Box mt={8} ml={8}>
                        <Typography variant="h4" color="initial">
                            Rewards Program
                        </Typography>
                        <Typography variant="body1" color="initial" mt={1}>
                            Join today and access these member benefits. Unlock
                            more with every ride.
                        </Typography>
                        <ButtonGroup sx={{ gap: 2, mt: 4 }}>
                            <Link to="/signup">
                                <Button
                                    variant="contained"
                                    style={{
                                        borderRadius: 20,
                                        backgroundColor: deepPurple[500],
                                    }}
                                >
                                    Join Now
                                </Button>
                            </Link>
                            <Link to="/signin">
                                <Button
                                    variant="outlined"
                                    style={{
                                        borderRadius: 20,
                                        color: deepPurple[500],
                                        borderColor: deepPurple[500],
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </ButtonGroup>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <Box
            sx={{
                pt: 4,
                px: 8,
            }}
        >
            <Box>
                {localStorage.getItem("accessToken") ? (
                    <Link
                        to="/rewards"
                        sx={{
                            textDecoration: "none",
                        }}
                    >
                        <Button
                            startIcon={<ArrowBackOutlinedIcon />}
                            color="secondary"
                        >
                            Back to rewards page
                        </Button>
                    </Link>
                ) : (
                    <Link
                        to="/"
                        sx={{
                            textDecoration: "none",
                        }}
                    >
                        <Button
                            startIcon={<ArrowBackOutlinedIcon />}
                            color="secondary"
                        >
                            Go Back
                        </Button>
                    </Link>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    mt: 4,
                    width: "100%",
                    transition: "all 0.2s",
                    gap: 2,
                    minHeight: "100vh",
                }}
            >
                {joinProgram()}

                <Card
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        // animation: "all 2s ease-in-out",
                        transition: "all 2s",
                        boxShadow: 4,
                        borderRadius: 4,
                    }}
                >
                    <Typography variant="h4" color="black" py={3}>
                        XINA Membership Tiers
                    </Typography>
                    <TabContext
                        value={value}
                        sx={{ transition: "all 0.5s ease-in-out" }}
                    >
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                display: "flex",
                                justifyContent: "center",
                                width: "90%",
                            }}
                        >
                            <TabList
                                onChange={handleChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab label="Bronze" value="bronze" />
                                <Tab label="Silver" value="silver" />
                                <Tab label="Gold" value="gold" />
                            </TabList>
                        </Box>
                        <TabPanel
                            value="bronze"
                            sx={{ transition: "all 0.5s ease-in-out" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PedalBikeOutlinedIcon
                                    fontSize="large"
                                    sx={{ color: "#B05900" }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            fontWeight: "medium",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Bronze Tier
                                    </Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="grey"
                                    >
                                        Available for all new members
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        my: 4,
                                        display: "flex",
                                        gap: 5,
                                        alignItems: "start",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <LeaderboardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "medium",
                                                textAlign: "center",
                                            }}
                                        >
                                            Friend's Leaderboard (Coming Soon)
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Add your friends and share your
                                            rides with them.
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "214px",
                                            gap: 1,
                                        }}
                                    >
                                        <ConfirmationNumberOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                        >
                                            Birthday Voucher
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Enjoy 50% off vouchers rides usable
                                            during your birthday month
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <CreditCardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Redeem XCredits For ECredits
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Exchange $5 credits for 5000
                                            XCredits
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel
                            value="silver"
                            sx={{ transition: "all 0.5s ease-in-out" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PedalBikeOutlinedIcon
                                    fontSize="large"
                                    sx={{ color: "#CDCDCD" }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            fontWeight: "medium",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Silver Tier
                                    </Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="grey"
                                    >
                                        500 XCredits per month
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        my: 4,
                                        display: "flex",
                                        gap: 5,
                                        justifyContent: "center",
                                        alignItems: "start",
                                        width: "75%",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <LeaderboardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "medium",
                                                textAlign: "center",
                                            }}
                                        >
                                            Friend's Leaderboard (Coming Soon)
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Add your friends and share your
                                            rides with them.
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "214px",
                                            gap: 1,
                                        }}
                                    >
                                        <ConfirmationNumberOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                        >
                                            Birthday Voucher
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Enjoy 3 x 50% off vouchers rides
                                            usable during your birthday month
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <CreditCardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Redeem XCredits For ECredits
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Exchange $5 credits for 5000
                                            XCredits
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <img src="../clean_hands.svg"></img>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Get 10% More Points
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Earn 10% more points on purchases
                                            made for each ride
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "214px",
                                            gap: 1,
                                        }}
                                    >
                                        <DiscountOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Exclusive Vouchers
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Enjoy exclusive vouchers before
                                            users in the first tier
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel
                            value="gold"
                            sx={{ transition: "all 0.5s ease-in-out" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PedalBikeOutlinedIcon
                                    fontSize="large"
                                    sx={{ color: "#FFD453" }}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            fontWeight: "medium",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Gold Tier
                                    </Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="grey"
                                    >
                                        1000 XCredits per month
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        my: 4,
                                        display: "flex",
                                        gap: 5,
                                        justifyContent: "center",
                                        alignItems: "start",
                                        width: "75%",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <LeaderboardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Friend's Leaderboard (Coming Soon)
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Add your friends and share your
                                            rides with them.
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "214px",
                                            gap: 1,
                                        }}
                                    >
                                        <ConfirmationNumberOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                        >
                                            Birthday Voucher
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Enjoy 3 x 50% off vouchers rides
                                            usable during your birthday month
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <CreditCardOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Redeem XCredits For ECredits
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Exchange $5 credits for 5000
                                            XCredits
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "230px",
                                            gap: 1,
                                        }}
                                    >
                                        <img src="../clean_hands.svg"></img>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Get 25% More Points
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Earn 10% more points on purchases
                                            made for each ride
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "214px",
                                            gap: 1,
                                        }}
                                    >
                                        <DiscountOutlinedIcon />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "medium" }}
                                            align="center"
                                        >
                                            Exclusive Vouchers
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            align="center"
                                        >
                                            Enjoy exclusive vouchers before
                                            users in the first tier
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Card>
            </Box>
        </Box>
    );
}

export default membership;
