import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
    Box,
    List,
    ListItemText,
    ListItem,
    Divider,
    IconButton,
} from "@mui/material";

import UserContext from "../contexts/UserContext";

import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import dashboardIcon from "../assets/dashboard.svg";
import bikeIcon from "../assets/sideBike.svg";
import shieldIcon from "../assets/shield.svg";
import billIcon from "../assets/bill.svg";
import ticketIcon from "../assets/ticket.svg";
import wallet from "../assets/wallet.svg";
import reportIcon from "../assets/report.svg";

function ProfileSideNav() {
    const { user, isAdmin, isAdminDashboard } = useContext(UserContext);
    const location = useLocation();
    const [isMinimized, setIsMinimized] = useState(() => {
        const storedState = localStorage.getItem("snMinimized");
        return storedState ? JSON.parse(storedState) : false;
    });

    useEffect(() => {
        localStorage.setItem("snMinimized", JSON.stringify(isMinimized));
    }, [isMinimized]);

    const userPages = [
        {
            text: "Profile information",
            path: !isAdminDashboard ? "profile" : "admin/profile",
            icon: dashboardIcon,
        },
        {
            text: "Password & security",
            path: "security",
            icon: shieldIcon,
        },
        {
            text: "Wallet",
            path: "wallet",
            icon: wallet,
        },
        {
            text: "Rental history",
            path: "rental-history",
            icon: bikeIcon,
        },
        {
            text: "Billing history",
            path: "billing-history",
            icon: billIcon,
        },
        {
            text: "Redemption history",
            path: "redemption-history",
            icon: ticketIcon,
        },
        {
            text: "Fault Reports",
            path: "fault-reports",
            icon: reportIcon,
        },
    ];

    const adminPages = [
        {
            text: "Profile information",
            path: "admin/profile",
            icon: dashboardIcon,
        },
        {
            text: "Password & security",
            path: !isAdminDashboard ? "security" : "admin/security",
            icon: shieldIcon,
        },
    ];
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
                        primary={`Welcome, ${
                            user.firstName + " " + user.lastName
                        }`}
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
                {isAdminDashboard
                    ? adminPages.map((page) => (
                          <ListItem
                              key={page.text}
                              sx={{
                                  my: 1,
                                  borderRadius: 2,
                                  backgroundColor: location.pathname.startsWith(
                                      `/${page.path}`
                                  )
                                      ? "#EADDFF"
                                      : "#FFF",
                              }}
                          >
                              <Link
                                  to={`/${page.path}`}
                                  style={{
                                      textDecoration: "none",
                                      display: "flex",
                                      gap: "30px",
                                      color: "black",
                                      width: "100%",
                                      alignItems: "center",
                                  }}
                              >
                                  <img
                                      src={page.icon}
                                      alt={page.text}
                                      width={26}
                                      height={26}
                                  />
                                  <ListItemText
                                      primary={page.text}
                                      sx={{
                                          opacity: isMinimized ? 0 : 1,
                                          visibility: isMinimized
                                              ? "hidden"
                                              : "visible",
                                          whiteSpace: "nowrap",
                                          transition:
                                              "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                                      }}
                                  />
                              </Link>
                          </ListItem>
                      ))
                    : userPages.map((page) => (
                          <ListItem
                              key={page.text}
                              sx={{
                                  my: 1,
                                  borderRadius: 2,
                                  backgroundColor: location.pathname.startsWith(
                                      `/${page.path}`
                                  )
                                      ? "#EADDFF"
                                      : "#FFF",
                              }}
                          >
                              <Link
                                  to={`/${page.path}`}
                                  style={{
                                      textDecoration: "none",
                                      display: "flex",
                                      gap: "30px",
                                      color: "black",
                                      width: "100%",
                                      alignItems: "center",
                                  }}
                              >
                                  <img
                                      src={page.icon}
                                      alt={page.text}
                                      width={26}
                                      height={26}
                                  />
                                  <ListItemText
                                      primary={page.text}
                                      sx={{
                                          opacity: isMinimized ? 0 : 1,
                                          whiteSpace: "nowrap",
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

export default ProfileSideNav;
