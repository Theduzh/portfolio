import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
} from "@mui/material";
import http from "../../../http.js";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SideNav, NavContainer } from "../../../components";

function EditPromotion() {
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [cardFile, setCardFile] = useState(null);
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
        stripe_promotion_id: "",
    });
    const navigate = useNavigate();

    const navigateback = () => {
        navigate("/admin/promotions");
    };

    const post_stripe_api = async (data) => {
        try {
            const stripe_data = await http.put(
                "/checkout/updatePromotionCode",
                data
            );
            console.log(stripe_data.data);
            return stripe_data.data;
        } catch (error) {
            console.error("Error posting to Stripe API:", error);
            throw error; // Rethrow the error to handle it in the calling code
        }
    };

    const complete_post = async (data, checkout_data) => {
        try {
            // const stripe_data = await post_stripe_api(checkout_data);

            // data.stripe_coupon_id = stripe_data.new_stripe_coupon_id;
            // data.stripe_promotion_id = stripe_data.new_stripe_promotion_id;

            const response = await http.put(`/promotion/${id}`, data);

            console.log(response.data);
            navigate("/admin/promotions");
        } catch (error) {
            // Handle errors here
        }
    };

    useEffect(() => {
        http.get(`/promotion/${id}`).then((res) => {
            res.data.start_date = res.data.start_date.split("T")[0];
            res.data.end_date = res.data.end_date.split("T")[0];
            setPromotionInfo(res.data);
            setImageFile(res.data.image_file);
        });
    }, []);

    const formik = useFormik({
        initialValues: promotion_info,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            promotion_name: yup.string().trim().min(3).max(100).required(),
            promotion_description: yup
                .string()
                .trim()
                .min(3)
                .max(500)
                .required(),
            promotion_code: yup.string().trim().min(3).max(100).required(),
            start_date: yup.date(),
            end_date: yup
                .date()
                .min(
                    yup.ref("start_date"),
                    "End Date cannot be after start date"
                ),
            status: yup.boolean(),
            discount_amount: yup.number().min(0).max(100).required(),
            total_uses: yup.number().min(1).max(1000).required(),
        }),
        onSubmit: (data) => {
            console.log(data);
            data.promotion_name = data.promotion_name.trim();
            data.promotion_description = data.promotion_description.trim();
            data.discount_amount = parseFloat(data.discount_amount);
            data.total_uses = parseFloat(data.total_uses);
            data.start_time =
                data.start_time.split(":")[0] +
                ":" +
                data.start_time.split(":")[1];
            data.end_time =
                data.end_time.split(":")[0] + ":" + data.end_time.split(":")[1];

            if (imageFile) {
                data.image_file = imageFile;
            }

            if (cardFile) {
                data.card_image = cardFile;
            }
            const checkout_data = {
                promotion_id: data.stripe_promotion_id,
                promotion_name: data.promotion_name.trim(),
                promotion_code: data.promotion_code.trim(),
                discount_amount: parseFloat(data.discount_amount),
                total_uses: parseFloat(data.total_uses),
            };
            complete_post(data, checkout_data);
        },
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 10240 * 1024) {
                toast.error("Maximum file size is 10MB");
                return;
            }
            let formData = new FormData();
            formData.append("file", file);
            http.post("/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log(res.data);
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const onCardChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 10240 * 1024) {
                toast.error("Maximum file size is 10MB");
                return;
            }
            let formData = new FormData();
            formData.append("file", file);
            http.post("/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log(res.data);
                    setCardFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        } else {
            toast.error("Please select an image");
        }
    };

    return (
        <NavContainer>
            <Box sx={{ px: "25px" }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit Promotion
                </Typography>
                <Typography
                    variant="body1"
                    color="secondary"
                    onClick={navigateback}
                    mt={3}
                >
                    🠔 Back to promotions
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                            <TextField
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
                                id="outlined-multiline-static"
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
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                                label="Promotion code"
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
                            <FormControl
                                fullWidth
                                error={
                                    formik.touched.image_file &&
                                    Boolean(formik.errors.image_file)
                                }
                                margin="normal"
                            >
                                <Box sx={{ textAlign: "left", mt: 2 }}>
                                    <label htmlFor="image_file">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            type="button"
                                            color={
                                                formik.touched.image_file &&
                                                Boolean(
                                                    formik.errors.image_file
                                                )
                                                    ? "error"
                                                    : "primary"
                                            }
                                        >
                                            Upload Banner Image
                                        </Button>
                                    </label>
                                    <input
                                        id="image_file"
                                        name="image_file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                    {formik.touched.image_file &&
                                        Boolean(formik.errors.image_file) && (
                                            <FormHelperText error>
                                                {formik.errors.image_file}
                                            </FormHelperText>
                                        )}
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <FormControl
                                fullWidth
                                error={
                                    formik.touched.card_image &&
                                    Boolean(formik.errors.card_image)
                                }
                                margin="normal"
                            >
                                <Box sx={{ textAlign: "left", mt: 2 }}>
                                    <label htmlFor="card_image">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            type="button"
                                            color={
                                                formik.touched.card_image &&
                                                Boolean(
                                                    formik.errors.card_image
                                                )
                                                    ? "error"
                                                    : "primary"
                                            }
                                        >
                                            Upload Card Image
                                        </Button>
                                    </label>
                                    <input
                                        id="card_image"
                                        name="card_image"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        type="file"
                                        onChange={onCardChange}
                                    />
                                    {formik.touched.card_image &&
                                        Boolean(formik.errors.card_image) && (
                                            <FormHelperText error>
                                                {formik.errors.card_image}
                                            </FormHelperText>
                                        )}
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} md={3}></Grid>
                        <Grid item xs={3} md={3}></Grid>
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        <Button variant="contained" type="submit">
                            Edit Promotion
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Box>
        </NavContainer>
    );
}

export default EditPromotion;
