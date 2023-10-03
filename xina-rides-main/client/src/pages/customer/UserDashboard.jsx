import {
    BikeLayer,
    MapCenterController,
    MapWrapper,
    Navbar,
    PositionMarker,
    PromoBanner,
    getCurrentLocation,
    QuickAccessButtons,
    FaultReportForm,
} from "../../components";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Typography,
} from "@mui/material";
import http from "../../http";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
    const navigate = useNavigate();
    const [location, setLocation] = useState({
        latitude: 1.3609,
        longitude: 103.81169,
    });
    const [open, setOpen] = useState(false);
    const [isLocationSetFlag, setLocationFlag] = useState(false);
    const [bikeList, setBikeList] = useState([]);
    const [nearbyBikes, setNearbyBikes] = useState([]);
    const [activeBikes, setActiveBikes] = useState([]);
    const [recentRides, setRecentRides] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        getLocation();
        getBikes();
        getRecentRides();
        getActiveBikes();
    }, []);

    useEffect(() => {
        document.title = "User Dashboard | XinaRides";
        if (isLocationSetFlag) {
            fetchBikesNearby().then((data) => {
                setNearbyBikes(data);
                console.log(data);
            });
        }
        // setMapCenter([location.latitude, location.longitude], 15);
    }, [location]);

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format hours, minutes, and seconds separately
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        // Combine and return the formatted duration in HH:MM:SS format
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const getBikes = () => {
        http.get("/bike/rentable").then((res) => {
            setBikeList(res.data);
        });
    };

    const getActiveBikes = async () => {
        const userId = await http
            .get("/user/profile")
            .then((res) => res.data.id);
        http.get("/order").then((res) => {
            setActiveBikes(
                res.data.filter(
                    (order) =>
                        order.orderStatus == "ACTIVE" && order.userId === userId
                )
            );
        });
    };

    const handleOpen = (id) => {
        setCurrentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getRecentRides = () => {
        http.get("/order").then((res) => {
            setRecentRides(
                res.data
                    .filter((order) => order.orderStatus == "COMPLETED")
                    .reverse()
                    .slice(0, 2)
            );
        });
    };

    const getLocation = () => {
        getCurrentLocation().then(
            (coords) => {
                setLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                setLocationFlag(true);
            },
            (error) => {
                console.warn(error);
                setLocationFlag(false);
            }
        );
    };

    const fetchBikesNearby = async () => {
        console.log(location.latitude, location.longitude);
        const req = await http.get("/bike/rentable", {
            params: {
                latitude: location.latitude,
                longitude: location.longitude,
                maxDistance: 2,
            },
        });
        const data = req.data;

        return data;
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ px: 2, py: 3 }}>
                <PromoBanner />
                <Divider
                    variant="fullWidth"
                    color="#CCC2DC"
                    sx={{ my: 3, opacity: 0.5 }}
                />
                <QuickAccessButtons />
                <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
                    <Card sx={{ width: "75%" }}>
                        <CardContent>
                            <Typography>Rent a bike</Typography>
                            <Box sx={{ display: "flex", gap: 5 }}>
                                <Box sx={{ width: "35%", maxWidth: "300px" }}>
                                    <Typography>Near You</Typography>
                                    <Divider />
                                    {nearbyBikes.map((bike) => (
                                        <Box
                                            key={bike.bikeId}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                backgroundColor: "#EADDFF",
                                                p: 2,
                                                borderRadius: 2,
                                                gap: 1,
                                            }}
                                        >
                                            <Typography>{bike.name}</Typography>
                                            <Typography>
                                                Distance:{" "}
                                                {bike.distance.toFixed(2)} km
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ width: "100%" }}>
                                    <MapWrapper
                                        center={[1.3609, 103.81169]}
                                        scrollWheelZoom={true}
                                        style={{
                                            height: "70vh",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <PositionMarker
                                            pos={[
                                                location.latitude,
                                                location.longitude,
                                            ]}
                                        />
                                        <MapCenterController
                                            center={[
                                                location.latitude,
                                                location.longitude,
                                            ]}
                                            zoom={15}
                                        />
                                        <BikeLayer
                                            key="bike-layer"
                                            bikes={bikeList}
                                        />
                                    </MapWrapper>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            width: "25%",
                        }}
                    >
                        <Card>
                            <CardContent>
                                <Typography
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    Active Rentals
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        maxHeight: "250px",
                                        overflow: "auto",
                                        scrollbarWidth: "thin", // For Firefox compatibility
                                        scrollbarColor: "#888888 #f0f0f0", // Scrollbar color
                                        "&::-webkit-scrollbar": {
                                            width: "8px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            background: "#f0f0f0", // Scrollbar track color
                                            borderRadius: "10px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "#888888", // Scrollbar thumb color
                                            borderRadius: "10px",
                                        },
                                        "&::-webkit-scrollbar-corner": {
                                            background: "#f0f0f0", // Scrollbar corner color
                                        },
                                        pr: 1,
                                    }}
                                >
                                    {activeBikes.map((order) => (
                                        <Box
                                            key={order.orderId}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                backgroundColor: "#EADDFF",
                                                p: 2,
                                                borderRadius: 2,
                                                gap: 1,
                                            }}
                                        >
                                            <Typography>
                                                Bike ID: {order.bikeId}
                                            </Typography>
                                            <Typography>
                                                Time elapsed:{" "}
                                                {formatDuration(
                                                    dayjs(
                                                        order.rentalEndDate
                                                            ? order.rentalEndDate
                                                            : new Date()
                                                    ).diff(
                                                        dayjs(order.createdAt),
                                                        "second"
                                                    )
                                                )}
                                            </Typography>
                                            <Button
                                                sx={{
                                                    borderRadius: 1,
                                                    width: "100%",
                                                    color: "#000",
                                                    backgroundColor: "#FFF",
                                                    border: "1px solid black",
                                                }}
                                                onClick={() => {
                                                    navigate(
                                                        `/rental-history/${order.orderId}`
                                                    );
                                                }}
                                            >
                                                End Ride
                                            </Button>
                                        </Box>
                                    ))}
                                    {activeBikes.length == 0 && (
                                        <Typography
                                            sx={{ textAlign: "center" }}
                                        >
                                            No recent rides found
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                        <Card sx={{ flexGrow: "1" }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Typography>Recent rides</Typography>
                                    <Link
                                        to="/rental-history"
                                        sx={{ textDecoration: "none" }}
                                    >
                                        <Typography>View all</Typography>
                                    </Link>
                                </Box>
                                {recentRides.length == 0 && (
                                    <Typography>
                                        No recent rides found
                                    </Typography>
                                )}
                                {recentRides.map((order) => (
                                    <Box
                                        key={order.orderId}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            backgroundColor: "#EADDFF",
                                            p: 2,
                                            borderRadius: 2,
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Typography>
                                                    Order ID: {order.orderId}
                                                </Typography>
                                                <Button
                                                    onClick={() =>
                                                        handleOpen(
                                                            order.orderId
                                                        )
                                                    }
                                                    sx={{
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <img
                                                        src="../src/assets/report_problem.svg"
                                                        style={{
                                                            padding: 0,
                                                            margin: 0,
                                                        }}
                                                    />
                                                </Button>
                                            </Box>
                                            <Typography>
                                                Date ended:{" "}
                                                {dayjs(
                                                    order.rentalEndDate
                                                ).format("DD/MM/YYYY")}
                                            </Typography>
                                        </Box>
                                        <Button
                                            sx={{
                                                borderRadius: 1,
                                                width: "100%",
                                                color: "#000",
                                                backgroundColor: "#FFF",
                                                border: "1px solid black",
                                            }}
                                            onClick={() => {
                                                navigate(
                                                    `/rental-history/${order.orderId}`
                                                );
                                            }}
                                        >
                                            View Ride
                                        </Button>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                        <FaultReportForm
                            open={open}
                            onClose={handleClose}
                            id={currentId}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default UserDashboard;
