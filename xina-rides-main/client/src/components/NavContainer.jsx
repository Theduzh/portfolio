import { Box } from "@mui/material";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
import { useLocation } from "react-router-dom";
import ProfileSideNav from "./ProfileSideNav";

function NavContainer({ children }) {
    const location = useLocation();

    return (
        <Box sx={{ overflowY: "hidden" }}>
            <Navbar />
            <Box sx={{ display: "flex" }}>
                {location.pathname.startsWith("/admin") &&
                location.pathname !== "/admin/profile" &&
                location.pathname !== "/admin/security" &&
                location.pathname !== "/admin/editprofile" &&
                location.pathname !== "/editprofile" ? (
                    <SideNav />
                ) : (
                    <ProfileSideNav />
                )}
                <Box
                    sx={{
                        p: 7.5,
                        width: "100%",
                        height: "calc(100vh - 200px)",
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
                        "&::-webkit-scrollbar-corner": {
                            background: "#f0f0f0", // Scrollbar corner color
                        },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default NavContainer;
