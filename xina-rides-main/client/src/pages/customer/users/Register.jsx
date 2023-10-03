import { Grid, Box, Typography, TextField, Button, Link } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object().shape({
            firstName: yup
                .string()
                .trim()
                .min(2, "First name must be at least 2 characters long")
                .max(50, "First name must be at most 50 characters long")
                .matches(
                    /^[a-z ,.'-]+$/i,
                    "First name cannot contain any special characters"
                )
                .required("First name is a required field"),
            lastName: yup
                .string()
                .trim()
                .min(2, "Last name must be at least 2 characters long")
                .max(50, "Last name must be at most 2 characters long")
                .matches(
                    /^[a-z ,.'-]+$/i,
                    "Last name cannot contain any special characters"
                )
                .required("Last name is a required field"),
            email: yup
                .string()
                .trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters")
                .required("Email is a required field"),
            password: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters long")
                .max(50, "Password must be at most 50 characters long")
                .required("Password is a required field")
                .notOneOf([yup.ref("email"), null], "Password cannot be email"),
            confirmPassword: yup
                .string()
                .required()
                .oneOf([yup.ref("password"), null], "Passwords do not match"),
        }),
        onSubmit: (data) => {
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post("/user/signup", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/signin");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });
    return (
        <>
            <Grid
                container
                direction="row"
                sx={{
                    height: "100vh",
                    background:
                        "linear-gradient(to right top, #5BFB88, #81F0FF)",
                }}
            >
                <Grid item xs md={0.5}></Grid>
                <Grid
                    item
                    xs
                    md={6.5}
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "right",
                        }}
                    >
                        <Typography variant="h3" color="#2030BD">
                            Xina Rides
                        </Typography>
                        <Typography variant="subtitle2" color="#2030BD">
                            Bike Rental
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="h3"
                            component="p"
                            sx={{ width: "400px" }}
                        >
                            Riding made EASY with us.
                        </Typography>
                        <Typography variant="h5" component="p">
                            Start riding in minutes!
                        </Typography>
                    </Box>
                    <Typography>Already have an account?</Typography>{" "}
                    <Link
                        to="/signin"
                        onClick={() => navigate("/signin")}
                        sx={{ textDecoration: "none", cursor: "pointer" }}
                    >
                        Log in
                    </Link>
                </Grid>
                <Grid
                    item
                    xs
                    md={5}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: "85%",
                        }}
                        component="form"
                        onSubmit={formik.handleSubmit}
                    >
                        <Grid
                            container
                            direction="row"
                            spacing={4}
                            sx={{ my: 2 }}
                        >
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    label="First Name"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.firstName &&
                                        Boolean(formik.errors.firstName)
                                    }
                                    helperText={
                                        formik.touched.firstName &&
                                        formik.errors.firstName
                                    }
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    label="Last Name"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.lastName &&
                                        Boolean(formik.errors.lastName)
                                    }
                                    helperText={
                                        formik.touched.lastName &&
                                        formik.errors.lastName
                                    }
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            sx={{ my: 2 }}
                            autoComplete="off"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                            }
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
                        />
                        <TextField
                            fullWidth
                            sx={{ my: 2 }}
                            autoComplete="off"
                            label="Password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.password &&
                                Boolean(formik.errors.password)
                            }
                            helperText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                        <TextField
                            fullWidth
                            sx={{ my: 2 }}
                            autoComplete="off"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.confirmPassword &&
                                Boolean(formik.errors.confirmPassword)
                            }
                            helperText={
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                            }
                        />
                        <Button
                            fullWidth
                            disableRipple
                            variant="contained"
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer />
        </>
    );
}

export default Register;
