import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControlLabel,
    FormGroup,
    Checkbox,
} from "@mui/material";
import ProfileSideNav from "../../../components/ProfileSideNav";
import { useFormik } from "formik";
import * as yup from "yup";
import UserContext from "../../../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import http from "../../../http";
import { toast, ToastContainer } from "react-toastify";
import { NavContainer } from "../../../components";

function AccSecurity() {
    const { user, setUser } = useContext(UserContext);

    const handleToggle = () => {
        http.put("/user/toggle2fa").then(() => {
            http.get("/user/profile")
                .then((res) => {
                    setUser(res.data);
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        });
    };

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            oldPassword: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters long")
                .max(50, "Password must be at most 50 characters long")
                .required("Old password is a required field"),
            newPassword: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters long")
                .max(50, "Password must be at most 50 characters long")
                .required("New password is a required field")
                .notOneOf([user.email, null], "Password cannot be email"),
            confirmNewPassword: yup
                .string()
                .required("Confirm password is a required field")
                .oneOf(
                    [yup.ref("newPassword"), null],
                    "Passwords do not match"
                ),
        }),
        onSubmit: (data) => {
            data.oldPassword = data.oldPassword.trim();
            data.newPassword = data.newPassword.trim();
            http.put("/user/changepassword", data)
                .then((res) => {
                    http.get("user/profile").then((res) => {
                        setUser(res.data);
                    });
                    toast.success(res.data.message);
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Password & Security
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Box>
                    <Typography variant="subtitle">
                        Privacy and Security
                    </Typography>
                    <Paper
                        sx={{
                            height: "30rem",
                            width: "18rem",
                        }}
                    >
                        <Box
                            sx={{
                                p: 5,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                alignItems: "start",
                            }}
                        >
                            <Typography variant="subtitle" width="100%">
                                Two-Factor Authentication
                            </Typography>
                            <Button
                                size="small"
                                color="secondary"
                                onClick={handleToggle}
                            >
                                Turn {user.twoFAEnabled == true ? "off" : "on"}{" "}
                                2FA
                            </Button>
                        </Box>
                    </Paper>
                </Box>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Typography variant="subtitle">Edit Password</Typography>
                    <Paper
                        sx={{
                            height: "30rem",
                            width: "35rem",
                        }}
                    >
                        <Box
                            sx={{
                                pt: 5,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                variant="filled"
                                sx={{
                                    width: "80%",
                                }}
                                color="secondary"
                                label="Old Password"
                                type="password"
                                name="oldPassword"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.oldPassword &&
                                    Boolean(formik.errors.oldPassword)
                                }
                                helperText={
                                    formik.touched.oldPassword &&
                                    formik.errors.oldPassword
                                }
                            />
                            <TextField
                                variant="filled"
                                sx={{ width: "80%" }}
                                color="secondary"
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.newPassword &&
                                    Boolean(formik.errors.newPassword)
                                }
                                helperText={
                                    formik.touched.newPassword &&
                                    formik.errors.newPassword
                                }
                            />
                            <TextField
                                variant="filled"
                                sx={{ width: "80%" }}
                                color="secondary"
                                label="Confirm New Password"
                                type="password"
                                name="confirmNewPassword"
                                value={formik.values.confirmNewPassword}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.confirmNewPassword &&
                                    Boolean(formik.errors.confirmNewPassword)
                                }
                                helperText={
                                    formik.touched.confirmNewPassword &&
                                    formik.errors.confirmNewPassword
                                }
                            />
                            <Box
                                sx={{
                                    mt: 6,
                                    display: "flex",
                                    justifyContent: "end",
                                    width: "80%",
                                }}
                            >
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    type="submit"
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <ToastContainer />
        </NavContainer>
    );
}

export default AccSecurity;
