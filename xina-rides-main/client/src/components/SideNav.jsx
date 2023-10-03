import { ChevronLeft, ChevronRight, ReportProblem } from "@mui/icons-material";
import { Box, List, ListItemText, ListItem, Divider } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import dashboardIcon from "../assets/dashboard.svg";
import bikeIcon from "../assets/sideBike.svg";
import usersIcon from "../assets/users.svg";
import promotionsIcon from "../assets/promotions.svg";
import clipboardIcon from "../assets/clipboard.svg";
import ticketIcon from "../assets/ticket.svg";
import reportIcon from "../assets/report.svg";
import UserContext from "../contexts/UserContext";

const sideMenuOptions = [
    {
        name: "Dashboard",
        icon: dashboardIcon,
    },
    {
        name: "Bikes",
        icon: bikeIcon,
    },
    {
        name: "Users",
        icon: usersIcon,
    },
    {
        name: "Orders",
        icon: clipboardIcon,
    },
    {
        name: "Promotions",
        icon: promotionsIcon,
    },
    {
        name: "Rewards",
        icon: ticketIcon,
    },
    {
        name: "Fault Reports",
        icon: reportIcon,
    },
];

function SideNav() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [isMinimized, setIsMinimized] = useState(() => {
        const storedState = localStorage.getItem("snMinimized");
        return storedState ? JSON.parse(storedState) : false;
    });

    useEffect(() => {
        localStorage.setItem("snMinimized", JSON.stringify(isMinimized));
    }, [isMinimized]);

    return (
        <Box
            sx={{
                px: 2,
                borderRight: "1px solid lightgrey",
                width: isMinimized ? 60 : "35%",
                maxWidth: isMinimized ? 60 : 250,
                transition: "all 0.3s ease",
            }}
        >
            <List>
                <ListItem
                    sx={{
                        display: "flex",
                        gap: "30px",
                        my: 1,
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="a"
                        onClick={() => setIsMinimized(!isMinimized)}
                        sx={{ ":hover": { cursor: "pointer" } }}
                    >
                        {isMinimized ? <ChevronRight /> : <ChevronLeft />}
                    </Box>
                    <ListItemText
                        primary={`Welcome, ${user.firstName}`}
                        sx={{
                            whiteSpace: "nowrap",
                            opacity: isMinimized ? 0 : 1,
                            visibility: isMinimized ? "hidden" : "visible",
                            transition:
                                "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                        }}
                    />
                </ListItem>
                <Divider />
                {sideMenuOptions.map((option) => (
                    <ListItem
                        key={option.name}
                        sx={{
                            my: 1,
                            borderRadius: 2,
                            backgroundColor: location.pathname.startsWith(
                                `/admin/${
                                    option.name.toLowerCase().includes(" ")
                                        ? option.name
                                              .toLowerCase()
                                              .replace(" ", "-")
                                        : option.name.toLowerCase()
                                }`
                            )
                                ? "#EADDFF"
                                : "#FFF",
                        }}
                    >
                        <Link
                            to={`/admin/${
                                option.name.toLowerCase().includes(" ")
                                    ? option.name
                                          .toLowerCase()
                                          .replace(" ", "-")
                                    : option.name.toLowerCase()
                            }`}
                            style={{
                                textDecoration: "none",
                                display: "flex",
                                gap: "30px",
                                color: "black",
                                width: "100%",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <img
                                src={option.icon}
                                alt={option.name}
                                width={26}
                                height={26}
                            />
                            <ListItemText
                                primary={option.name}
                                sx={{
                                    opacity: isMinimized ? 0 : 1,
                                    visibility: isMinimized
                                        ? "hidden"
                                        : "visible",
                                    transition:
                                        "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                                }}
                            />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default SideNav;
