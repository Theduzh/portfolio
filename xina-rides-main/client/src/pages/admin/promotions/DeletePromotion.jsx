import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import http from "../../../http";
import { useFormik } from "formik";
import { NavContainer } from "../../../components";

function DeletePromotion() {
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [promotion_info, setPromotionInfo] = useState({
        promotion_name: "",
        promotion_description: "",
        promotion_code: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        discount_amount: 0,
        total_uses: 0,
        stripe_coupon_id: "",
        stripe_promotion_id: ""
    });
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: promotion_info,
        enableReinitialize: true,
    });

    useEffect(() => {
        http.get(`/promotion/${id}`).then((res) => {
            res.data.start_date = res.data.start_date.split("T")[0];
            res.data.end_date = res.data.end_date.split("T")[0];
            setPromotionInfo(res.data);
            setImageFile(res.data.image_file);
        });
    }, []);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const delete_stripe_api = async () => {
        try {
            await http.delete(
                `/checkout/deletePromotionCode/${promotion_info.stripe_coupon_id}/${promotion_info.stripe_promotion_id}`
            );
        } catch (error) {
            console.error("Error posting to Stripe API:", error);
            throw error;
        }
    };

    const deletePromotion = async () => {
        try {
            // await delete_stripe_api();
            const response = await http.get(`/promotion/${id}`);
            const updatedData = {
                ...response.data,
                is_deleted: true,
                start_time: `${response.data.start_time.split(":")[0]}:${
                    response.data.start_time.split(":")[1]
                }`,
                end_time: `${response.data.end_time.split(":")[0]}:${
                    response.data.end_time.split(":")[1]
                }`,
            };
            await http.put(`/promotion/${id}`, updatedData);
            console.log("Promotion deleted and updated:", updatedData);
            navigate("/admin/promotions");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <NavContainer>
            <Typography variant="h5" sx={{ my: 2 }}>
                Delete Promotion
            </Typography>
            <Box component="form" onSubmit={handleOpen}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                        <TextField
                            disabled={true}
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Promotion Name"
                            name="promotion_name"
                            value={formik.values.promotion_name}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.promotion_name &&
                                Boolean(formik.errors.promotion_name)
                            }
                            helperText={
                                formik.touched.promotion_name &&
                                formik.errors.promotion_name
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            disabled={true}
                            fullWidth
                            autoComplete="off"
                            type="date"
                            margin="normal"
                            label="Start Date"
                            name="start_date"
                            value={formik.values.start_date}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.start_date &&
                                Boolean(formik.errors.start_date)
                            }
                            helperText={
                                formik.touched.start_date &&
                                formik.errors.start_date
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            disabled={true}
                            fullWidth
                            type="date"
                            margin="normal"
                            label="End Date"
                            name="end_date"
                            value={formik.values.end_date}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.end_date &&
                                Boolean(formik.errors.end_date)
                            }
                            helperText={
                                formik.touched.end_date &&
                                formik.errors.end_date
                            }
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField
                            disabled={true}
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Promotion Description"
                            name="promotion_description"
                            value={formik.values.promotion_description}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.promotion_description &&
                                Boolean(formik.errors.promotion_description)
                            }
                            helperText={
                                formik.touched.promotion_description &&
                                formik.errors.promotion_description
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            fullWidth
                            disabled={true}
                            margin="normal"
                            autoComplete="off"
                            label="Total Uses"
                            name="total_uses"
                            value={formik.values.total_uses}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.total_uses &&
                                Boolean(formik.errors.total_uses)
                            }
                            helperText={
                                formik.touched.total_uses &&
                                formik.errors.total_uses
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            fullWidth
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            autoComplete="off"
                            label="Discount Amount (%)"
                            name="discount_amount"
                            value={formik.values.discount_amount}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.discount_amount &&
                                Boolean(formik.errors.discount_amount)
                            }
                            helperText={
                                formik.touched.discount_amount &&
                                formik.errors.discount_amount
                            }
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField
                            disabled={true}
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Promotion Code"
                            name="promotion_code"
                            value={formik.values.promotion_code}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.promotion_code &&
                                Boolean(formik.errors.promotion_code)
                            }
                            helperText={
                                formik.touched.promotion_code &&
                                formik.errors.promotion_code
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            type="time"
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            label="Start Time"
                            name="start_time"
                            value={formik.values.start_time}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.start_time &&
                                Boolean(formik.errors.start_time)
                            }
                            helperText={
                                formik.touched.start_time &&
                                formik.errors.start_time
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            type="time"
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            label="End Time"
                            name="end_time"
                            value={formik.values.end_time}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.end_time &&
                                Boolean(formik.errors.end_time)
                            }
                            helperText={
                                formik.touched.end_time &&
                                formik.errors.end_time
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            disabled={true}
                            margin="normal"
                            autoComplete="off"
                            label="Image File"
                            name="img"
                            value={formik.values.image_file}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.image_file &&
                                Boolean(formik.errors.image_file)
                            }
                            helperText={
                                formik.touched.image_file &&
                                formik.errors.image_file
                            }
                        />
                    </Grid>
                    <Grid item xs={3} md={3}>
                        <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            disabled={true}
                            margin="normal"
                            autoComplete="off"
                            label="Card Image"
                            name="img"
                            value={formik.values.card_image}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.card_image &&
                                Boolean(formik.errors.card_image)
                            }
                            helperText={
                                formik.touched.card_image &&
                                formik.errors.card_image
                            }
                        />
                    </Grid>
                    <Grid item xs={6} md={6}></Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleOpen}
                        color="error"
                    >
                        Delete Promotion
                    </Button>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Promotion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Promotion?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deletePromotion}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </NavContainer>
    );
}

export default DeletePromotion;
