import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import global from "../global";
import { Marker } from "react-leaflet";
import {
    MapWrapper,
    MapCenterController,
    DisableMapControls,
    BikeLayerNoCheckoutLogic,
} from "../components";
import http from "../http";
import { useEffect, useState } from "react";

function RentalCard({ rental }) {
    const [bike, setBike] = useState({});

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
    useEffect(() => {
        http.get(`/bike/${rental.bikeId}`).then((res) => {
            setBike(res.data);
        });
    }, []);

    return (
        <Card>
            <CardContent sx={{ display: "flex", gap: 2, position: "relative" }}>
                {bike.bikeLat && (
                    <MapWrapper
                        showAttrib={false}
                        center={[
                            parseFloat(bike.bikeLat),
                            parseFloat(bike.bikeLon),
                        ]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{
                            width: 150,
                            height: 150,
                        }}
                    >
                        <BikeLayerNoCheckoutLogic bikes={[bike]} />
                        <DisableMapControls />
                        <MapCenterController
                            center={[bike.bikeLat, bike.bikeLon]}
                            zoom={15}
                        />
                    </MapWrapper>
                )}
                <Box>
                    <Typography variant="h6" fontSize={16}>
                        {dayjs(rental.createdAt).format(global.datetimeFormat)}
                    </Typography>
                    <Typography variant="h6" fontSize={16}>
                        Bike No. {rental.bikeId}
                    </Typography>
                    {rental.rentalEndDate !== null && (
                        <Typography variant="h6" fontSize={16}>
                            Order Total: ${rental.orderTotal}
                        </Typography>
                    )}

                    {/* Arrow to bottom right of card */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "10px",
                            right: "15px",
                        }}
                    >
                        <Link to={`/rental-history/${rental.orderId}`}>
                            <img
                                src="/src/assets/arrowright.svg"
                                alt=""
                                width={24}
                            />
                        </Link>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default RentalCard;
