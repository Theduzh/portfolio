import { Box, Button, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

QuickAccessBtn.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

function QuickAccessBtn({ title, icon, link }) {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(link)}
            sx={{
                backgroundColor: "#EADDFF",
                height: 90,
                width: "100%",
                borderRadius: "16px",
                boxShadow: 2
            }}
        >
            <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 } }}>
                <img src={icon} alt="icon" />
                <Typography
                    component="p"
                    sx={{
                        ml: 1,
                        fontSize: 24,
                        textTransform: "none",
                        display: "flex",
                        alignItems: "center",
                        color: "#000",
                    }}
                >
                    {title}
                </Typography>
            </Box>
        </Button>
    );
}

export default QuickAccessBtn;
