import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Box,
    Select,
    MenuItem,
    Grid,
    InputLabel,
    Chip,
    Slider,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

function FilterCard({ filterValues, setFilterValues, data, fetchFunction }) {
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleOrderTotalChange = (event, newValue) => {
        setFilterValues((prevValues) => ({
            ...prevValues,
            orderTotalMin: newValue[0],
            orderTotalMax: newValue[1],
        }));
    };

    const handleRemoveFilter = (filterName) => {
        setFilterValues((prevValues) => ({
            ...prevValues,
            [filterName]:
                filterName === "orderStatus" ||
                filterName === "faultReportStatus"
                    ? "All" // Reset the filter value for the clicked filter
                    : "",
        }));
    };

    useEffect(() => {
        fetchFunction();
    }, []);

    const maxValue = Math.max(data.map((order) => order.orderTotal)) || 1000;

    return (
        <Card sx={{ mt: 1 }}>
            <CardContent>
                <Typography variant="h6" fontSize={18} mb={1}>
                    Filters
                </Typography>
                <Grid container spacing={2}>
                    {filterValues.faultReportStatus && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>Status</InputLabel>
                            <TextField
                                name="faultReportStatus"
                                value={filterValues.faultReportStatus}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                select
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="In Progress">
                                    In Progress
                                </MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                            </TextField>
                        </Grid>
                    )}
                    {filterValues.orderStatus && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>Status</InputLabel>
                            <TextField
                                name="orderStatus"
                                value={filterValues.orderStatus}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                select
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </TextField>
                        </Grid>
                    )}
                    {filterValues.faultReportDate !== undefined && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>Start Date</InputLabel>
                            <TextField
                                name="faultReportDate"
                                type="date"
                                variant="outlined"
                                size="small"
                                value={filterValues.faultReportDate}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    )}
                    {filterValues.faultReportResolvedDate !== undefined && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>End Date</InputLabel>
                            <TextField
                                name="faultReportResolvedDate"
                                type="date"
                                variant="outlined"
                                size="small"
                                value={filterValues.faultReportResolvedDate}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    )}
                    {filterValues.rentalStartDate !== undefined && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>Start Date</InputLabel>
                            <TextField
                                name="rentalStartDate"
                                type="date"
                                variant="outlined"
                                size="small"
                                value={filterValues.rentalStartDate}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    )}

                    {filterValues.rentalEndDate !== undefined && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>End Date</InputLabel>
                            <TextField
                                name="rentalEndDate"
                                type="date"
                                variant="outlined"
                                size="small"
                                value={filterValues.rentalEndDate}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    )}
                    {(filterValues.orderTotalMin ||
                        filterValues.orderTotalMax) && (
                        <Grid item xs={12} md={3}>
                            <InputLabel>Order Total Range</InputLabel>
                            <Box
                                sx={{
                                    px: 2,
                                    display: "flex",
                                    mt: 1,
                                }}
                            >
                                <Slider
                                    value={[
                                        filterValues.orderTotalMin || 0,
                                        filterValues.orderTotalMax || maxValue,
                                    ]}
                                    onChange={handleOrderTotalChange}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `$${value}`}
                                    min={0}
                                    max={maxValue} // Update the max value based on your data
                                    step={10} // Update the step value based on your data
                                    sx={{}}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
                <Box display="flex" alignItems="center" mt={2}>
                    <Typography variant="subtitle2" sx={{ marginRight: 1 }}>
                        Filters applied:
                    </Typography>
                    {/* Show a Chip for each active filter */}
                    {filterValues.orderStatus &&
                        filterValues.orderStatus !== "All" && (
                            <Chip
                                label={`Status: ${filterValues.orderStatus}`}
                                onDelete={() =>
                                    handleRemoveFilter("orderStatus")
                                }
                                sx={{
                                    mr: 1,
                                    backgroundColor: "#EADDFF",
                                    borderRadius: "10px",
                                }}
                            />
                        )}
                    {filterValues.faultReportStatus &&
                        filterValues.faultReportStatus !== "All" && (
                            <Chip
                                label={`Status: ${filterValues.faultReportStatus}`}
                                onDelete={() =>
                                    handleRemoveFilter("faultReportStatus")
                                }
                                sx={{
                                    mr: 1,
                                    backgroundColor: "#EADDFF",
                                    borderRadius: "10px",
                                }}
                            />
                        )}

                    {filterValues.faultReportDate && (
                        <Chip
                            label={`Start Date: ${filterValues.faultReportDate}`}
                            onDelete={() =>
                                handleRemoveFilter("faultReportDate")
                            }
                            sx={{
                                mr: 1,
                                backgroundColor: "#EADDFF",
                                borderRadius: "10px",
                            }}
                        />
                    )}
                    {filterValues.faultReportResolvedDate && (
                        <Chip
                            label={`End Date: ${filterValues.faultReportResolvedDate}`}
                            onDelete={() =>
                                handleRemoveFilter("faultReportResolvedDate")
                            }
                            sx={{
                                mr: 1,
                                backgroundColor: "#EADDFF",
                                borderRadius: "10px",
                            }}
                        />
                    )}

                    {filterValues.rentalStartDate && (
                        <Chip
                            label={`Start Date: ${filterValues.rentalStartDate}`}
                            onDelete={() =>
                                handleRemoveFilter("rentalStartDate")
                            }
                            sx={{
                                mr: 1,
                                backgroundColor: "#EADDFF",
                                borderRadius: "10px",
                            }}
                        />
                    )}
                    {filterValues.rentalEndDate && (
                        <Chip
                            label={`End Date: ${filterValues.rentalEndDate}`}
                            onDelete={() => handleRemoveFilter("rentalEndDate")}
                            sx={{
                                mr: 1,
                                backgroundColor: "#EADDFF",
                                borderRadius: "10px",
                            }}
                        />
                    )}
                    {filterValues.orderTotalMin ||
                    filterValues.orderTotalMax ? (
                        <Chip
                            label={`Order Total: $${
                                filterValues.orderTotalMin || "0"
                            } to $${filterValues.orderTotalMax || "1000"}`}
                            onDelete={() => {
                                handleRemoveFilter("orderTotalMin");
                                handleRemoveFilter("orderTotalMax");
                            }}
                            sx={{
                                mr: 1,
                                backgroundColor: "#EADDFF",
                                borderRadius: "10px",
                            }}
                        />
                    ) : null}
                </Box>
            </CardContent>
        </Card>
    );
}

FilterCard.propTypes = {
    filterValues: PropTypes.shape({
        orderStatus: PropTypes.string,
        rentalStartDate: PropTypes.string,
        rentalEndDate: PropTypes.string,
        orderTotalMin: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        orderTotalMax: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }).isRequired,
    setFilterValues: PropTypes.func.isRequired,
};

export default FilterCard;
