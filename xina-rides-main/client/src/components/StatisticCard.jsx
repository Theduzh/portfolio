import { Box, Card, Typography } from "@mui/material";
import PropTypes from "prop-types";

function StatisticCard({ title, value }) {
    return (
        <Card sx={{ p: 2.5, mt: 2.5 }}>
            <Typography variant="p" fontSize={16} fontWeight="medium">
                {title}
            </Typography>
            <Box sx={{ display: "flex" }}>
                <Typography variant="p" fontSize={28} fontWeight="medium">
                    {value}
                </Typography>
            </Box>
        </Card>
    );
}

StatisticCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

export default StatisticCard;
