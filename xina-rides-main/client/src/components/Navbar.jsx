import {
    Box,
    AppBar,
    Container,
    Typography,
    Toolbar,
    Avatar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Menu as MenuComponent,
    MenuItem,
    Divider,
    Button,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Notifications, Menu } from "@mui/icons-material";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { useState, useEffect, useContext } from "react";
import http from "../http";
import UserContext from "../contexts/UserContext";
import NotificationMenu from "./NotificationMenu";

const menuOptions = ["Home", "Rent", "Promotions", "Rewards"];

function Navbar() {
    const { user, setUser, isAdmin, isAdminDashboard, setIsAdminDashboard } =
        useContext(UserContext);
    const [userInfo, setUserInfo] = useState({
        fullName: "",
        email: "",
    });
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get("/user/profile").then((res) => {
                setUserInfo({
                    id: res.data.id,
                    fullName: res.data.firstName + " " + res.data.lastName,
                    email: res.data.email,
                });
            });
        }
    }, []);

    const location = useLocation();

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        localStorage.clear();
        window.location = "/";

        setUser(null);
    };

    const renderMenuOptions = () => {
        if (!location.pathname.startsWith("/admin")) {
            return menuOptions.map((option) => (
                <ListItem
                    key={option}
                    onClick={toggleDrawer}
                    component={Link}
                    to={option === "Home" ? "/" : `/${option.toLowerCase()}`}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        borderRadius: 10,
                    }}
                >
                    <ListItemText primary={option} />
                </ListItem>
            ));
        }
    };

    const toggleAdminOn = () => {
        setIsAdminDashboard(true);
    };

    const toggleAdminOff = () => {
        navigate("/");
        setIsAdminDashboard(false);
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "white",
                color: "black",
                height: 80,
                py: 1,
                px: isMobile ? 1 : 0,
                display: "flex",
                background: location.pathname.startsWith("/admin")
                    ? "linear-gradient(135deg, #7AFFA7 0%, #5BE7D6 36.41%, #B0B0FF 83.10%, #B77EFF 100%)"
                    : "white",
                zIndex: 100,
            }}
            className="navbar"
        >
            <Toolbar disableGutters={true}>
                <Container
                    maxWidth={false}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                        }}
                    >
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "end",
                                    gap: 0,
                                }}
                                onClick={toggleAdminOff}
                            >
                                <Typography variant="h4" sx={{ mx: 2 }}>
                                    Xina Rides
                                </Typography>
                                <Typography variant="p" sx={{ mx: 2 }}>
                                    Bike Rental
                                </Typography>
                            </Box>
                        </Link>
                    </Box>
                    {isMobile && !location.pathname.startsWith("/admin") ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer}
                            >
                                <Menu />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer}
                            >
                                <List sx={{ width: 200, px: 2, py: 3 }}>
                                    <Link
                                        to={isAdmin ? "/" : "/admin"}
                                        style={{
                                            textDecoration: "none",
                                            color: "black",
                                        }}
                                    >
                                        <Box sx={{ pb: 2 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{ mx: 2 }}
                                            >
                                                Xina Rides
                                            </Typography>
                                        </Box>
                                    </Link>
                                    {renderMenuOptions()}
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {renderMenuOptions()}
                            </Box>

                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                }}
                            >
                                <NotificationMenu />
                                <IconButton
                                    id="account-button"
                                    aria-controls={
                                        open ? "account-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                >
                                    <Avatar
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            cursor: "pointer",
                                            "&:hover": { opacity: 0.75 },
                                        }}
                                        alt={
                                            user.firstName + " " + user.lastName
                                        }
                                        src={`${
                                            import.meta.env.VITE_FILE_BASE_URL
                                        }${user.profilePic}`}
                                    />
                                </IconButton>
                            </Box>
                        </>
                    )}

                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            alignItems: "center",
                        }}
                    >
                        <NotificationMenu />
                        <IconButton
                            id="account-button"
                            aria-controls={open ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            <Avatar
                                sx={{
                                    width: 42,
                                    height: 42,
                                    cursor: "pointer",
                                    "&:hover": { opacity: 0.75 },
                                }}
                            />
                        </IconButton>
                        <MenuComponent
                            id="account-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "account-button",
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <Box
                                sx={{ p: 2, sx: "inherit" }}
                                onClick={handleClose}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "start",
                                        gap: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{ width: 48, height: 48 }}
                                        alt={
                                            user.firstName + " " + user.lastName
                                        }
                                        src={`${
                                            import.meta.env.VITE_FILE_BASE_URL
                                        }${user.profilePic}`}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Typography fontWeight="medium">
                                            {userInfo.fullName}
                                        </Typography>
                                        <Typography variant="body2">
                                            {userInfo.email}
                                        </Typography>
                                        <Button
                                            color="inherit"
                                            variant="outlined"
                                            component={Link}
                                            to={
                                                !isAdminDashboard
                                                    ? "/profile"
                                                    : "/admin/profile"
                                            }
                                            sx={{
                                                py: 0.5,
                                                mt: 1,
                                                bgcolor: "#EADDFF",
                                            }}
                                        >
                                            Manage Your Account
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider />
                            {isAdmin && (
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                    to="/admin/"
                                    onClick={toggleAdminOn}
                                >
                                    <MenuItem
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            gap: 4,
                                            fontWeight: "medium",
                                        }}
                                        onClick={handleClose}
                                    >
                                        <DisplaySettingsOutlinedIcon />
                                        Admin Dashboard
                                    </MenuItem>
                                </Link>
                            )}
                            <Link
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                                to="/rewards"
                            >
                                <MenuItem
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        gap: 4,
                                        fontWeight: "medium",
                                    }}
                                    onClick={handleClose}
                                >
                                    <LoyaltyOutlinedIcon /> My rewards
                                </MenuItem>
                            </Link>
                            <MenuItem
                                sx={{
                                    py: 2,
                                    px: 3,
                                    gap: 4,
                                    fontWeight: "medium",
                                }}
                                onClick={handleClose}
                            >
                                <CreditCardOutlinedIcon /> Payment methods
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    py: 2,
                                    px: 3,
                                    gap: 4,
                                    fontWeight: "medium",
                                    color: "error",
                                }}
                                onClick={handleLogOut}
                            >
                                <ExitToAppOutlinedIcon color="error" /> Log out
                            </MenuItem>
                        </MenuComponent>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
