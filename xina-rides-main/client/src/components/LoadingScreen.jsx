import { Box, CircularProgress } from "@mui/material";

function LoadingScreen() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default LoadingScreen;
