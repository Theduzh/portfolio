import { useContext, useState } from "react";
import {
    Typography,
    Avatar,
    Button,
    Box,
    Grid,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper,
    TextField,
} from "@mui/material";
import dayjs from "dayjs";
import global from "../../../day";
import UserContext from "../../../contexts/UserContext";

import http from "../../../http";
import { toast, ToastContainer } from "react-toastify";
import { NavContainer } from "../../../components";

function Profile() {
    const { user, isAdminDashboard } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");

    const handleClick = () => {
        window.location = !isAdminDashboard
            ? "/editprofile"
            : "/admin/editprofile";
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDelete = () => {
        http.post("/user/validatePassword", { password: password })
            .then(() => {
                http.delete("/user/")
                    .then(() => {
                        localStorage.clear();
                        window.location = "/";
                    })
                    .catch(function (err) {
                        toast.error(`${err.response.data.message}`);
                    });
            })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Profile Information
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDisplay: "row",
                    justifyContent: "space-between",
                    mt: 3,
                    width: "65vw",
                }}
            >
                <Box
                    sx={{
                        height: "15rem",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        flexBasis: "18rem",
                    }}
                >
                    <Avatar
                        sx={{
                            mb: 2,
                            width: "8rem",
                            height: "8rem",
                            fontSize: "3rem",
                        }}
                        alt={user.firstName + " " + user.lastName}
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                            user.profilePic
                        }`}
                    />
                    {user.aboutMe ? (
                        <Card
                            sx={{
                                minHeight: "8em",
                                height: "auto",
                                flexGrow: "30%",
                                p: 2,
                                textAlign: "left",
                                width: "15rem",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    mb: 1,
                                }}
                            >
                                About Me
                            </Typography>
                            {user.aboutMe}
                        </Card>
                    ) : null}
                </Box>
                <Paper sx={{ padding: 2, borderRadius: 3, flexBasis: "30rem" }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h5" component="p">
                            Details
                        </Typography>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleClick}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                    <Grid container direction="row" height="15rem" mt={2}>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Full Name
                            </Typography>
                            {user.firstName + " " + user.lastName}
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Phone Number
                            </Typography>
                            {user.phoneNo}
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Email
                            </Typography>
                            {user.email}
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Country
                            </Typography>
                            {user.country}
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Gender
                            </Typography>
                            {user.gender}
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" component="p">
                                Date of Birth
                            </Typography>
                            {user.dateOfBirth &&
                                dayjs(user.dateOfBirth).format(
                                    global.dateFormat
                                )}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Button
                variant="text"
                onClick={handleOpen}
                color="error"
                sx={{ mt: 10 }}
            >
                Delete Account
            </Button>
            <ToastContainer />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Delete Account?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. Confirm password to
                        proceed.
                    </DialogContentText>
                    <TextField
                        value={password}
                        type="password"
                        onChange={handleChange}
                        placeholder="Confirm password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </NavContainer>
    );
}

export default Profile;
