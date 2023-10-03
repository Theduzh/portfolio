import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Notifications from "@mui/icons-material/Notifications";
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    Popover,
    Typography,
} from "@mui/material";
import http from "../http.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";

function NotificationMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateToNotifications = () => {
        navigate("/notifications", { replace: true });
    };

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
        <Box sx={{ mr: 2 }}>
            <IconButton sx={{ color: "black" }} onClick={handleClick}>
                <Badge
                    badgeContent={
                        notifications.filter(
                            (notif) => notif.status == "UNREAD"
                        ).length
                    }
                    color="error"
                    sx={{ cursor: "pointer" }}
                >
                    <Notifications sx={{ width: 28, height: 28 }} />
                </Badge>
            </IconButton>
            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        width: "350px",
                        borderRadius: "10px",
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 0.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="subtitle1" sx={{ my: 1 }}>
                        Notifications{" "}
                        {`(${
                            notifications.filter(
                                (notif) => notif.status == "UNREAD"
                            ).length
                        })`}
                    </Typography>
                    {notifications.filter((notif) => notif.status == "UNREAD")
                        .length > 0 && (
                        <Button
                            sx={{ color: "black" }}
                            onClick={readAllNotifications}
                        >
                            <Typography variant="subtitle1">Clear</Typography>
                        </Button>
                    )}
                </Box>
                <Divider />
                <Box
                    sx={{
                        maxHeight: "250px", // Adjust this value based on your design
                        overflowY: "auto",
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
                    }}
                >
                    <List
                        sx={{
                            py: 0,
                            borderRadius: "10px",
                        }}
                    >
                        {notifications.map((notification, index) => (
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
                                }}
                            >
                                <ListItem
                                    onClick={handleClose}
                                    sx={{
                                        backgroundColor:
                                            notification.status == "UNREAD"
                                                ? "#EADDFF"
                                                : "#FFFFFF",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 1,
                                        py: 2,
                                    }}
                                >
                                    <Typography fontSize={15}>
                                        {notification.message}
                                    </Typography>
                                    <Typography fontSize={10}>
                                        {formatTimeAgo(notification.createdAt)}
                                    </Typography>
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                        {notifications.length == 0 && (
                            <ListItem
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    No notifications
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                </Box>
                <Divider />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        sx={{ color: "black", width: "100%" }}
                        onClick={navigateToNotifications}
                    >
                        <Typography variant="subtitle1">VIEW ALL</Typography>
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
}

export default NotificationMenu;
