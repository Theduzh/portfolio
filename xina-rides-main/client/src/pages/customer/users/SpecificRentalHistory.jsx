import React, { useEffect, useState } from "react";
import {
    FaultReportForm,
    NavContainer,
    getCurrentLocation,
} from "../../../components";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http.js";
import dayjs from "dayjs";
import global from "../../../global";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function SpecificRentalHistory() {
    const [rental, setRental] = useState({});
    const [orderStatus, setOrderStatus] = useState("");
    const rentalId = window.location.pathname.split("/")[2];
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState(null);
    const [open, setOpen] = useState(false);

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

    const updateOrderDetails = async () => {
        const order = await http.get(`/order/${rentalId}`);

        const bike = await http.get(`/bike/${order.data.bikeId}`);

        const rentalDuration = dayjs(new Date()).diff(
            dayjs(order.data.createdAt),
            "minute"
        );

        let orderTotal = 0;
        const roundedHours = Math.ceil(rentalDuration / 60);

        if (rentalDuration < 0) {
            throw new Error("Rental duration cannot be negative");
        } else if (rentalDuration > 5) {
            // if rentalDuration is > 5, charge hourly rate
            orderTotal = roundedHours * bike.data.rentalPrice;
        }

        // update the order with the rentalDuration and orderTotal
        await http.put(`/order/${rentalId}`, {
            ...order.data,
            rentalDuration,
            orderTotal: orderTotal,
        });

        fetchRental(rentalId);
    };

    const handleOpen = (id) => {
        setCurrentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEndTrip = async () => {
        const order = await http.get(`/order/${rentalId}`);

        const bike = await http.get(`/bike/${order.data.bikeId}`);

        // calculate rentalDuration and orderTotal here
        const rentalDuration = dayjs(new Date()).diff(
            dayjs(order.data.createdAt),
            "minute"
        );

        const rentalDurationInSeconds = dayjs(new Date()).diff(
            dayjs(order.data.createdAt),
            "second"
        );

        let orderTotal = 0;
        const roundedHours = Math.ceil(rentalDuration / 60);

        if (rentalDuration < 0) {
            throw new Error("Rental duration cannot be negative");
        } else if (rentalDuration > 5) {
            // if rentalDuration is > 5, charge hourly rate
            orderTotal = roundedHours * bike.data.rentalPrice;
            orderTotal = parseInt(orderTotal.toFixed(2));
        }

        // update the order with the rentalDuration and orderTotal
        await http.put(`/order/${rentalId}`, {
            ...order.data,
            rentalDurationInSeconds,
            orderTotal: parseFloat(orderTotal.toFixed(2)),
        });

        // navigate to checkout page
        if (orderTotal >= 1) {
            const coords = await getCurrentLocation();
            const checkoutDetails = {
                bike: bike.data,
                orderTotal: parseInt(orderTotal.toFixed(2)),
                rentalDuration: rentalDurationInSeconds,
                rentalId: rentalId,
                coords: coords,
            };

            navigate("/review-order", { state: checkoutDetails });
        } else {
            const updatedOrder = await http.put(`/order/${rentalId}/end`, {
                orderTotal: orderTotal,
            });
            getCurrentLocation().then(
                (coords) => {
                    http.put(`/bike/${updatedOrder.data.bikeId}`, {
                        ...bike.data,
                        name: bike.data.name,
                        rentalPrice: parseInt(bike.data.rentalPrice),
                        bikeLat: Number(coords.latitude),
                        bikeLon: Number(coords.longitude),
                        currentlyInUse: false,
                    });
                },
                (error) => {
                    alert(
                        "Geolocation needs to be available to end trip. On some computers, this can take some time, so try again."
                    );
                    console.warn(error);
                }
            );

            window.location.reload();
        }
    };

    const fetchRental = async (rentalId) => {
        try {
            const response = await http.get(`/order/${rentalId}`);
            const {
                rentalEndDate,
                orderTotal,
                createdAt,
                bikeId,
                orderId,
                orderPaymentMethod,
                orderPaymentStatus,
                rentalDuration,
                orderStatus,
            } = response.data;

            const rentalDurationInSeconds = dayjs(
                rentalEndDate ? rentalEndDate : new Date()
            ).diff(dayjs(createdAt), "second");

            const newResponse = {
                "Bike ID": bikeId,
                "Order ID": orderId,
                "Rental Start Date": dayjs(createdAt).format(
                    global.datetimeFormat
                ),
                "Rental End Date":
                    rentalEndDate !== null
                        ? dayjs(rentalEndDate).format(global.datetimeFormat)
                        : "N/A",
                "Order Total": orderTotal ? `$${orderTotal}` : "N/A",
                "Payment Method":
                    orderPaymentMethod == "" ? "N/A" : orderPaymentMethod,
                "Payment Status": orderPaymentStatus,
                "Rental Duration": rentalDuration
                    ? formatDuration(rentalDurationInSeconds)
                    : "N/A",
            };
            setRental(newResponse);
            setOrderStatus(orderStatus);
        } catch (error) {
            console.error(`Error fetching rentals: ${error}`);
        }
    };

    useEffect(() => {
        fetchRental(rentalId);
        updateOrderDetails();
    }, []);

    return (
        <NavContainer>
            <Link
                to="/rental-history"
                style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    color: "black",
                    display: "flex",
                    gap: 3,
                    marginBottom: 20,
                    padding: "5px 0px",
                }}
            >
                <ArrowBackIcon />
                <Typography variant="h5" fontSize={20}>
                    Back to rental history
                </Typography>
            </Link>
            <Grid container spacing={5}>
                {rental &&
                    Object.entries(rental).map(([key, value]) => (
                        <Grid
                            item
                            xs={6}
                            md={3}
                            key={key}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="p"
                                fontSize={16}
                                fontWeight="medium"
                                sx={{ color: "#79747E", mb: 2 }}
                            >
                                {key}
                            </Typography>
                            <Typography
                                variant="p"
                                fontSize={16}
                                fontWeight="medium"
                                sx={{ color: "#79747E", mb: 2 }}
                            >
                                {value}
                            </Typography>
                        </Grid>
                    ))}
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 5,
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        mt: 5,
                        width: "fit-content",
                        backgroundColor: "#FF1231",
                        color: "#000",
                        "&:hover": {
                            backgroundColor: "#FF0000",
                        },
                    }}
                    onClick={() => handleOpen(rentalId)}
                >
                    <Typography variant="p" fontSize={16} fontWeight="medium">
                        Report an issue
                    </Typography>
                </Button>

                {orderStatus === "ACTIVE" && (
                    <Button
                        variant="contained"
                        onClick={handleEndTrip}
                        sx={{
                            mt: 5,
                            width: "fit-content",
                            backgroundColor: "#EADDFF",
                            color: "#000",
                            "&:hover": {
                                backgroundColor: "#D4C3FF",
                            },
                        }}
                    >
                        <Typography
                            variant="p"
                            fontSize={16}
                            fontWeight="medium"
                        >
                            End Trip
                        </Typography>
                    </Button>
                )}
            </Box>
            <FaultReportForm open={open} onClose={handleClose} id={currentId} />
        </NavContainer>
    );
}

export default SpecificRentalHistory;
