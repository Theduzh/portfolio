import { Box, Container, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navbar } from "../../components";
import http from "../../http";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    const readAllNotifications = () => {
        http.put("/notification/read").then(() => {
            fetchNotifications();
        });
    };

    const fetchNotifications = () => {
        http.get("/notification").then((res) => {
            setNotifications(res.data);
        });
    };

    const readNotification = (index) => () => {
        http.put(
            `/notification/${notifications[index].notificationId}/read`
        ).then(() => {
            fetchNotifications();
        });
    };

    const formatTimeAgo = (createdAt) => {
        dayjs.extend(relativeTime);
        const timeAgo = dayjs(createdAt);

        const now = dayjs();
        const createdAtDate = dayjs(createdAt);

        if (createdAtDate.isSame(now, "day")) {
            return "Today | " + timeAgo.format("HH:mm");
        } else {
            return timeAgo.format("YYYY-MM-DD HH:mm");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);
    return (
        <>
            <Navbar />
            <Container maxWidth="xl">
                <Typography variant="h3" mt={4}>
                    Notifications
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        flexDirection: "column",
                        maxHeight: "calc(100vh - 200px)",
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
                        pr: 1,
                    }}
                >
                    {notifications.map((notification, index) => (
                        <>
                            <Box
                                key={index}
                                onClick={
                                    notification.status !== "READ"
                                        ? readNotification(index)
                                        : () => {}
                                }
                                sx={{
                                    ":hover": {
                                        cursor:
                                            notification.status !== "READ"
                                                ? "pointer"
                                                : "default",
                                    },
                                    border: "0.5px solid grey",
                                    borderRadius: 2,
                                    backgroundColor:
                                        notification.status == "UNREAD"
                                            ? "#EADDFF"
                                            : "#FFFFFF",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    p: 2,
                                }}
                            >
                                <Typography fontSize={15}>
                                    {notification.message}
                                </Typography>
                                <Typography fontSize={10}>
                                    {formatTimeAgo(notification.createdAt)}
                                </Typography>
                            </Box>
                        </>
                    ))}
                </Box>
            </Container>
        </>
    );
}

export default Notifications;
