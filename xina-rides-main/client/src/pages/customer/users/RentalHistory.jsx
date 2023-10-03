import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavContainer, RentalCard } from "../../../components";
import http from "../../../http.js";

function RentalHistory() {
    const [rentals, setRentals] = useState([]);

    const fetchRentals = async () => {
        try {
            const response = await http.get("/order/rental-history");
            setRentals(response.data);
        } catch (error) {
            console.error(`Error fetching rentals: ${error}`);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const hasActiveRentals =
        rentals && rentals.some((rental) => rental.orderStatus === "ACTIVE");
    const hasPastRentals =
        rentals &&
        rentals.some(
            (rental) =>
                rental.orderStatus === "COMPLETED" ||
                rental.orderStatus === "CANCELLED"
        );

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Rental history
            </Typography>
            <Typography
                variant="p"
                fontSize={16}
                fontWeight={"medium"}
                sx={{ color: "#79747E", mb: 2 }}
            >
                Active Rentals
            </Typography>

            <Box>
                {hasActiveRentals ? (
                    <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
                        {rentals.map(
                            (rental) =>
                                rental.orderStatus === "ACTIVE" && (
                                    <Grid
                                        item
                                        xs={12}
                                        lg={6}
                                        key={rental.orderId}
                                    >
                                        <RentalCard rental={rental} />
                                    </Grid>
                                )
                        )}
                    </Grid>
                ) : (
                    <Typography
                        variant="p"
                        fontSize={16}
                        fontWeight={"medium"}
                        sx={{ color: "#79747E" }}
                    >
                        No active rentals
                    </Typography>
                )}
            </Box>

            <Typography
                variant="p"
                fontSize={16}
                fontWeight={"medium"}
                sx={{ color: "#79747E" }}
            >
                Past Rentals
            </Typography>
            <Box>
                {hasPastRentals ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {rentals.map((rental) => {
                            if (
                                rental.orderStatus === "COMPLETED" ||
                                rental.orderStatus === "CANCELLED"
                            ) {
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        lg={6}
                                        key={rental.orderId}
                                    >
                                        <RentalCard rental={rental} />
                                    </Grid>
                                );
                            }
                            return null; // Return null for orders with other statuses
                        })}
                    </Grid>
                ) : (
                    <Typography
                        variant="p"
                        fontSize={16}
                        fontWeight={"medium"}
                        sx={{ color: "#79747E" }}
                    >
                        No active rentals
                    </Typography>
                )}
            </Box>
        </NavContainer>
    );
}

export default RentalHistory;
