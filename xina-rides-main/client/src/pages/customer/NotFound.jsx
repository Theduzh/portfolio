import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/");
    };
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h1" sx={{ mb: 2 }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Page not found
            </Typography>
            <Button variant="contained" onClick={handleBack}>
                Go back
            </Button>
        </Box>
    );
}

export default NotFound