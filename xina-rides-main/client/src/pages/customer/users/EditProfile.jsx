import { useState, useContext, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http.js";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../../../contexts/UserContext.js";
import NavContainer from "../../../components/NavContainer.jsx";

function EditProfile() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const [profileImageFile, setProfileImageFile] = useState(null);

    useEffect(() => {
        if (user.profilePic) {
            setProfileImageFile(user.profilePic);
        }
    });

    const onFileChange = (e) => {
        // If doesn't work, change to e.target.files[0]
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
                    console.log(res.data.filename);
                    setProfileImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
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
            gender: yup.string().trim().nullable(),
            phoneNo: yup.string().trim().max(15).nullable(),
            dateOfBirth: yup
                .date()
                .max(new Date(), "Date cannot be in the future")
                .nullable(),
            country: yup.string().trim(),
            aboutMe: yup
                .string()
                .trim()
                .max(100, "Bio must be at most 100 characters")
                .nullable(),
            profilePic: yup.string().trim().nullable(),
        }),
        onSubmit: (data) => {
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.email = data.email.trim();
            if (data.gender) {
                data.gender = data.gender.trim();
            }
            if (data.phoneNo) {
                data.phoneNo = data.phoneNo.trim();
            }
            if (data.country) {
                data.country = data.country.trim();
            }

            if (data.aboutMe) {
                data.aboutMe = data.aboutMe.trim();
            }

            if (profileImageFile) {
                data.profilePic = profileImageFile;
            }
            http.put("/user/editprofile", data)
                .then((res) => {
                    // After updating profile, reset user state variable
                    http.get("/user/profile")
                        .then((response) => {
                            setUser(response.data);
                        })
                        .catch(function (err) {
                            toast.error(`${err.response.data.message}`);
                        });
                    navigate("/profile");
                    window.location.reload();
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });

    return (
        <NavContainer>
            <Box>
                <Typography variant="h3" width="80%">
                    Profile Information
                </Typography>
                <Typography variant="subtitle2">
                    Profile Information &gt; Edit Profile
                </Typography>
            </Box>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container direction="row" sx={{ width: "80%" }}>
                    <Grid item xs md />
                    <Grid item xs md>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                mt: "100px",
                            }}
                        >
                            <Avatar
                                sx={{ width: 140, height: 140 }}
                                alt={user.firstName + " " + user.lastName}
                                src={`${
                                    import.meta.env.VITE_FILE_BASE_URL
                                }${profileImageFile}`}
                            />
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Button variant="text" component="label">
                                    Upload Image
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        onChange={onFileChange}
                                    />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs md />
                    <Grid item xs md={6}>
                        <Typography my={2}>Details</Typography>
                        <Grid container spacing={2} my={2}>
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
                                    autoComplete="off"
                                    label="First name"
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
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
                                    autoComplete="off"
                                    label="Last name"
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
                            <Grid item xs={12} md={12} lg={12} xl={12}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
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
                                        formik.touched.email &&
                                        formik.errors.email
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
                                    autoComplete="off"
                                    label="Gender"
                                    name="gender"
                                    select
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.gender &&
                                        Boolean(formik.errors.gender)
                                    }
                                    helperText={
                                        formik.touched.gender &&
                                        formik.errors.gender
                                    }
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    autoComplete="off"
                                    fullWidth
                                    label="Phone number"
                                    name="phoneNo"
                                    value={formik.values.phoneNo}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.phoneNo &&
                                        Boolean(formik.errors.phoneNo)
                                    }
                                    helperText={
                                        formik.touched.phoneNo &&
                                        formik.errors.phoneNo
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    autoComplete="off"
                                    fullWidth
                                    type="date"
                                    name="dateOfBirth"
                                    value={formik.values.dateOfBirth}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.dateOfBirth &&
                                        Boolean(formik.errors.dateOfBirth)
                                    }
                                    helperText={
                                        formik.touched.dateOfBirth &&
                                        formik.errors.dateOfBirth
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} xl={6}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
                                    autoComplete="off"
                                    label="Country"
                                    name="country"
                                    select
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.country &&
                                        Boolean(formik.errors.country)
                                    }
                                    helperText={
                                        formik.touched.country &&
                                        formik.errors.country
                                    }
                                >
                                    <MenuItem value="Singapore">
                                        Singapore
                                    </MenuItem>
                                    <MenuItem value="USA">USA</MenuItem>
                                    <MenuItem value="India">India</MenuItem>
                                    <MenuItem value="Australia">
                                        Australia
                                    </MenuItem>
                                    <MenuItem value="Philippines">
                                        Philippines
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} xl={12}>
                                <TextField
                                    variant="filled"
                                    color="secondary"
                                    fullWidth
                                    my={2}
                                    multiline={true}
                                    minRows={4}
                                    autoComplete="off"
                                    label="About me"
                                    name="aboutMe"
                                    value={formik.values.aboutMe}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.aboutMe &&
                                        Boolean(formik.errors.aboutMe)
                                    }
                                    helperText={
                                        formik.touched.aboutMe &&
                                        formik.errors.aboutMe
                                    }
                                />
                            </Grid>
                            <Grid item xs={10} md={10} lg={10} xl={10}></Grid>
                            <Grid item xs={2} md={2} lg={2} xl={2}>
                                <Button
                                    variant="contained"
                                    disableRipple
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer />
        </NavContainer>
    );
}

export default EditProfile;
