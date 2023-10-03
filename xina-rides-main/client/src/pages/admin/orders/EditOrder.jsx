import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { NavContainer, SideNav } from "../../../components";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http.js";
import dayjs from "dayjs";

function EditOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState({
        orderId: "",
        customerName: "",
        bikeId: "",
        orderTotal: 0,
        orderNotes: "",
        orderStatus: "",
        orderPaymentStatus: "",
        orderDuration: "",
        orderPaymentMethod: "",
        rentalStartDate: "",
        rentalStartTime: "",
        rentalEndDate: "",
        rentalEndTime: "",
        updatedAt: "",
        createdAt: "",
    });
    const navigate = useNavigate();

    async function fetchUserData(userId) {
        try {
            const userResponse = await http.get(`/user/getUser/${userId}`);
            return (
                userResponse.data.firstName + " " + userResponse.data.lastName
            ); // Assuming the user object has a property called 'name'
        } catch (error) {
            console.error(
                `Error fetching user data for user ID ${userId}: ${error.message}`
            );
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`/order/${id}`);
                const order = response.data;
                const customerName = await fetchUserData(order.userId);
                order.customerName = customerName;
                console.log(order);
                setOrder(order);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        fetchData();
    }, []);

    const duration = dayjs(order.rentalEndDate).diff(
        dayjs(order.createdAt),
        "second"
    );

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format hours, minutes, and seconds separately
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        // Combine and return the formatted duration in HH:MM:SS format
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const formik = useFormik({
        initialValues: {
            ...order,
            rentalStartDate: order.rentalStartDate
                ? dayjs(order.rentalStartDate).format("YYYY-MM-DD")
                : "",
            rentalEndDate: order.rentalEndDate
                ? dayjs(order.rentalEndDate).format("YYYY-MM-DD")
                : "",
            rentalStartTime: order.rentalStartDate
                ? dayjs(order.rentalStartDate).format("HH:mm")
                : "",
            rentalEndTime: order.rentalEndDate
                ? dayjs(order.rentalEndDate).format("HH:mm")
                : "",
            orderPaymentMethod:
                order.orderPaymentMethod !== ""
                    ? order.orderPaymentMethod
                    : "N/A",
            orderDuration: duration ? formatDuration(duration) : "N/A",
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            rentalStartDate: yup
                .date()
                .required("Rental Start Date is required"),
            rentalEndDate: yup.date().required("Rental End Date is required"),
            orderTotal: yup.number().required("Order Total is required"),
            orderNotes: yup
                .string()
                .trim()
                .max(500, "Order Notes must be at most 500 characters"),
            orderStatus: yup.string().required("Order Status is required"),
            orderPaymentStatus: yup
                .string()
                .required("Order Payment Status is required"),
            orderPaymentMethod: yup
                .string()
                .required("Order Payment Method is required"),
            rentalStartTime: yup
                .string()
                .matches(
                    /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                    "Invalid time format (HH:mm)"
                )
                .required("Start time is required"),
            rentalEndTime: yup
                .string()
                .matches(
                    /^(?:2[0-3]|[01]\d):[0-5]\d$/,
                    "Invalid time format (HH:mm)"
                )
                .required("End time is required"),
        }),
        onSubmit: async (values) => {
            const {
                rentalStartDate,
                rentalStartTime,
                rentalEndDate,
                rentalEndTime,
                orderStatus,
                orderTotal,
                ...updatedValues
            } = values;
            const convertedOrderTotal = parseFloat(orderTotal);

            const updatedRentalStartDate = dayjs(
                rentalStartDate + " " + rentalStartTime
            ).toDate();
            const updatedRentalEndDate = dayjs(
                rentalEndDate + " " + rentalEndTime
            ).toDate();
            // Convert orderTotal to a number
            const updatedValuesWithOrderTotal = {
                ...updatedValues,
                orderStatus: orderStatus.toUpperCase(),
                orderTotal: convertedOrderTotal,
                rentalStartDate: updatedRentalStartDate,
                rentalEndDate: updatedRentalEndDate,
            };

            await http
                .put(`/order/${id}`, updatedValuesWithOrderTotal)
                .then((res) => {
                    console.log(res.data);
                    navigate("/admin/orders");
                });
        },
    });

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Orders
            </Typography>
            <Typography
                variant="p"
                fontSize={16}
                fontWeight={"medium"}
                sx={{ color: "#79747E" }}
            >
                All Orders {">"} Edit Order
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} sx={{ width: "100%", mt: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Order ID"
                            name="orderId"
                            type="text"
                            value={formik.values.orderId}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.orderId &&
                                Boolean(formik.errors.orderId)
                            }
                            helperText={
                                formik.touched.orderId && formik.errors.orderId
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={true} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Bike ID"
                            name="bikeId"
                            type="text"
                            value={formik.values.bikeId}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.bikeId &&
                                Boolean(formik.errors.bikeId)
                            }
                            helperText={
                                formik.touched.bikeId && formik.errors.bikeId
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={true} // Set to "true" if the field should be disabled
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Customer"
                            name="customerName"
                            type="text"
                            value={formik.values.customerName}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.customerName &&
                                Boolean(formik.errors.customerName)
                            }
                            helperText={
                                formik.touched.customerName &&
                                formik.errors.customerName
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={true} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Payment Method"
                            name="orderPaymentMethod"
                            type="text"
                            value={formik.values.orderPaymentMethod}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.orderPaymentMethod &&
                                Boolean(formik.errors.orderPaymentMethod)
                            }
                            helperText={
                                formik.touched.orderPaymentMethod &&
                                formik.errors.orderPaymentMethod
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={true} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Order Duration"
                            name="orderDuration"
                            type="text"
                            value={formik.values.orderDuration}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.orderDuration &&
                                Boolean(formik.errors.orderDuration)
                            }
                            helperText={
                                formik.touched.orderDuration &&
                                formik.errors.orderDuration
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={true} // Set to "true" if the field should be disabled
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Order Total"
                            name="orderTotal"
                            type="number"
                            value={`${formik.values.orderTotal}`}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.orderTotal &&
                                Boolean(formik.errors.orderTotal)
                            }
                            helperText={
                                formik.touched.orderTotal &&
                                formik.errors.orderTotal
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="orderPaymentStatus-label">
                                Payment Status
                            </InputLabel>
                            <Select
                                labelId="orderPaymentStatus-label"
                                id="orderPaymentStatus"
                                name="orderPaymentStatus"
                                value={formik.values.orderPaymentStatus}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.orderPaymentStatus &&
                                    Boolean(formik.errors.orderPaymentStatus)
                                }
                                label="Payment Status"
                            >
                                <MenuItem value="UNPAID">UNPAID</MenuItem>
                                <MenuItem value="PAID">PAID</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="orderStatus-label">
                                Order Status
                            </InputLabel>
                            <Select
                                labelId="orderStatus-label"
                                id="orderStatus"
                                name="orderStatus"
                                value={formik.values.orderStatus}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.orderStatus &&
                                    Boolean(formik.errors.orderStatus)
                                }
                                label="Order Status"
                            >
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Rental Start Date"
                            name="rentalStartDate"
                            type="date"
                            value={formik.values.rentalStartDate}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.rentalStartDate &&
                                Boolean(formik.errors.rentalStartDate)
                            }
                            helperText={
                                formik.touched.rentalStartDate &&
                                formik.errors.rentalStartDate
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            type="time"
                            fullWidth
                            margin="normal"
                            label="Rental Start Time"
                            name="rentalStartTime"
                            value={formik.values.rentalStartTime}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.rentalStartTime &&
                                Boolean(formik.errors.rentalStartTime)
                            }
                            helperText={
                                formik.touched.rentalStartTime &&
                                formik.errors.rentalStartTime
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Rental End Date"
                            name="rentalEndDate"
                            type="date"
                            value={formik.values.rentalEndDate}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.rentalEndDate &&
                                Boolean(formik.errors.rentalEndDate)
                            }
                            helperText={
                                formik.touched.rentalEndDate &&
                                formik.errors.rentalEndDate
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            type="time"
                            fullWidth
                            margin="normal"
                            label="Rental End Time"
                            name="rentalEndTime"
                            value={formik.values.rentalEndTime}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.rentalEndTime &&
                                Boolean(formik.errors.rentalEndTime)
                            }
                            helperText={
                                formik.touched.rentalEndTime &&
                                formik.errors.rentalEndTime
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Notes"
                            name="orderNotes"
                            type="text"
                            value={formik.values.orderNotes}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.orderNotes &&
                                Boolean(formik.errors.orderNotes)
                            }
                            helperText={
                                formik.touched.orderNotes &&
                                formik.errors.orderNotes
                            }
                            multiline
                            rows={10}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false} // Set to "true" if the field should be disabled
                        />
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "right",
                        mr: "24px",
                        mt: 2,
                        gap: 2,
                    }}
                >
                    <Button
                        onClick={() => {
                            navigate(`/admin/orders`);
                        }}
                        sx={{
                            color: "black",
                            boxShadow:
                                "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
                            height: "35px",
                            p: "5px 15px",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#F7F2FA",
                            boxShadow:
                                "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
                            height: "35px",
                            p: "5px 15px",
                        }}
                        color="error"
                        type="submit"
                    >
                        Save changes
                    </Button>
                </Box>
            </Box>

            <Typography variant="subtitle1">
                Updated At:{" "}
                {dayjs(order.updatedAt).format("MMMM DD, YYYY h:mm A")}
            </Typography>
            <Typography variant="subtitle1">
                Created At:{" "}
                {dayjs(order.createdAt).format("MMMM DD, YYYY h:mm A")}
            </Typography>
            <ToastContainer />
        </NavContainer>
    );
}

export default EditOrder;
