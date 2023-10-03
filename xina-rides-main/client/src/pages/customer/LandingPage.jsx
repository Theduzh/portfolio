import { Box, Button, Divider, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import PedalBikeOutlinedIcon from "@mui/icons-material/PedalBikeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { PromoBanner } from "../../components";

function LandingPage() {
    return (
        <Box
            sx={{
                background: "linear-gradient(#81F0FF, #5BFB88)",
                py: 3,
                px: 5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography
                        variant="h4"
                        color="blue"
                        sx={{ mx: 2, fontWeight: "medium" }}
                    >
                        XINA RIDES
                    </Typography>
                    <Typography variant="p" color="blue" sx={{ mx: 2 }}>
                        Bike Rental
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 7, alignItems: "center" }}>
                    <Link
                        to={"/promotions"}
                        style={{ textDecoration: "none", color: "#21103D" }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: "medium" }}
                        >
                            Promotions
                        </Typography>
                    </Link>
                    <Link
                        to={"/membership"}
                        style={{ textDecoration: "none", color: "#21103D" }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: "medium" }}
                        >
                            Rewards
                        </Typography>
                    </Link>
                    <Link
                        to={"/signin"}
                        style={{ textDecoration: "none", color: "#21103D" }}
                    >
                        <Button variant="outlined" color="inherit">
                            Login
                        </Button>
                    </Link>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: 5,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "40vw",
                    }}
                >
                    <Typography variant="h3" color="initial" width={"40vw"}>
                        Start saving emissions with XINA RIDES today!
                    </Typography>
                    <Typography variant="body1" width={"30vw"}>
                        Rent a bike in minutes from Singapore's multi-modal
                        public transport operator and earn XCredits for every
                        mile of emissions saved!
                    </Typography>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "blue", width: 120 }}
                    >
                        Book Now
                    </Button>
                    <Divider />
                    <Box sx={{ display: "flex", gap: 5 }}>
                        <Box>
                            <Typography variant="h4" color="blue">
                                254,000
                            </Typography>
                            <Typography variant="body1">
                                Bike parking spaces
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="blue">
                                530 KM+
                            </Typography>
                            <Typography variant="body1">
                                Cycling paths
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <img
                        src="src/assets/landingpageimage.png"
                        alt="friends riding bikes"
                        style={{ width: "40vw", borderRadius: 120 }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    my: 3,
                }}
            >
                <Typography variant="h4">Why Xina Rides?</Typography>
                <Box sx={{ display: "flex", mt: 6, gap: 12 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: "20vw",
                        }}
                    >
                        <DiscountOutlinedIcon
                            sx={{ fontSize: 120, color: "blue" }}
                        />
                        <Typography variant="h6">Earn as you ride</Typography>
                        <Typography variant="body1" align="center">
                            Our points-based loyalty program provides the best
                            value for our customers
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: "20vw",
                        }}
                    >
                        <PedalBikeOutlinedIcon
                            sx={{ fontSize: 120, color: "blue" }}
                        />
                        <Typography variant="h6">
                            Rent a bike in minutes
                        </Typography>
                        <Typography variant="body1" align="center">
                            Always find a bike near you no matter where you are
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: "20vw",
                        }}
                    >
                        <VisibilityOutlinedIcon
                            sx={{ fontSize: 120, color: "blue" }}
                        />
                        <Typography variant="h6">
                            Rent a bike in minutes
                        </Typography>
                        <Typography variant="body1" align="center">
                            Our easy to read maps allows for increased
                            visibility for customers
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <PromoBanner />
        </Box>
    );
}

export default LandingPage;
