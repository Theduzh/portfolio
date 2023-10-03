import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http.js";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: yup.object().shape({
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
                .required("Password is a required field"),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post("/user/signin", data)
                .then((res) => {
                    setServerResponse({
                        accessToken: res.data.accessToken,
                        verificationCode: res.data.verificationCode,
                    });
                    if (res.data.verificationCode) {
                        setOpen(true);
                    } else {
                        localStorage.setItem(
                            "accessToken",
                            res.data.accessToken
                        );
                        http.get("/user/profile")
                            .then((res) => {
                                setUser(res.data);
                                navigate("/");
                                location.reload();
                            })
                            .catch(function (err) {
                                toast.error(`${err.response.data.message}`);
                            });
                    }
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });

    const [open, setOpen] = useState(false);
    const [serverResponse, setServerResponse] = useState(null);
    const [fieldValue, setFieldValue] = useState("");

    const handleChange = (e) => {
        setFieldValue(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (fieldValue == serverResponse.verificationCode) {
            localStorage.setItem("accessToken", serverResponse.accessToken);
            http.get("/user/profile")
                .then((res) => {
                    setUser(res.data);
                    navigate("/");
                    location.reload();
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        } else {
            toast.error("Verification code is incorrect");
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Verification Code</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the 6-digit verification code sent to your email.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="verifyCode"
                        label="Verification Code"
                        fullWidth
                        variant="standard"
                        inputProps={{
                            maxLength: 6,
                        }}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="secondary"
                        onClick={handleSubmit}
                        disabled={fieldValue.length < 6}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
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
                    <Box sx={{ display: "flex" }}>
                        <Typography variant="subtitle">
                            Don&apos;t have an account?&nbsp;
                        </Typography>
                        <Link
                            to="/signup"
                            onClick={() => navigate("/signup")}
                            sx={{ textDecoration: "none", cursor: "pointer" }}
                        >
                            <Typography>Sign up</Typography>
                        </Link>
                    </Box>
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
                        ></TextField>
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
                        ></TextField>
                        <Button
                            fullWidth
                            disableRipple
                            variant="contained"
                            type="submit"
                        >
                            Log in
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer />
        </>
    );
}

export default Login;
