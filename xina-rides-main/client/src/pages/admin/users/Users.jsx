import { CustomTable, NavContainer } from "../../../components";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Input,
    IconButton,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

import { useEffect, useState } from "react";
import http from "../../../http";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import global from "../../../global";

const headers = [
    "Account ID",
    "First Name",
    "Last Name",
    "Email",
    "Creation Date",
    "Account Type",
];

function Users() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        searchUsers();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key == "Enter") {
            searchUsers();
        }
    };

    const handleClickSearch = () => {
        searchUsers();
    };

    const handleClickClear = () => {
        setSearch("");
        searchUsers();
    };

    const searchUsers = () => {
        http.get(`/user/accounts?search=${search}`).then((res) => {
            console.log(res.data);
            setRows(
                res.data.map((result) => ({
                    id: result.id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    creationDate: dayjs(result.createdAt).format(
                        global.dateFormat
                    ),
                    AccountTypeId: result.accountType === 1 ? "User" : "Admin",
                }))
            );
        });
    };

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
            data.isAdmin = true;
            http.post("/user/signup", data)
                .then(() => {
                    http.get("/user/accounts").then((res) => {
                        setRows(
                            res.data.map((result) => ({
                                id: result.id,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.email,
                                creationDate: dayjs(result.createdAt).format(
                                    global.dateFormat
                                ),
                                accountType:
                                    result.accountType === 1 ? "User" : "Admin",
                            }))
                        );
                        setOpen(false);
                    });
                })
                .catch(function (err) {
                    toast.error(`${err.message}`);
                });
        },
    });

    return (
        <NavContainer>
            <Dialog open={open}>
                <DialogTitle>Create Admin Account</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
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
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
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
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
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
                            sx={{ my: 1 }}
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
                            sx={{ my: 1 }}
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
                        <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ margin: 1 }}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ margin: 1 }}
                                type="submit"
                            >
                                Create Account
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Box sx={{ width: "100%" }}>
                <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                    Users
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Input
                            color="secondary"
                            value={search}
                            placeholder="Search"
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <IconButton onClick={handleClickSearch}>
                            <Search />
                        </IconButton>
                        <IconButton onClick={handleClickClear}>
                            <Clear />
                        </IconButton>
                    </Box>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleOpen}
                    >
                        Add Admin Account
                    </Button>
                </Box>
                <CustomTable headers={headers} rows={rows} />
            </Box>
            <ToastContainer />
        </NavContainer>
    );
}

export default Users;
