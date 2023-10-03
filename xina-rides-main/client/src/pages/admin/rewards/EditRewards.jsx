import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    CardMedia,
    Button,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http";
import { useNavigate, useParams } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavContainer } from "../../../components";

function EditRewards() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const onClickCancel = () => {
        navigate("/admin/rewards");
    };

    const { id } = useParams();

    const [rewards, setrewards] = useState({
        header: "",
        category: "",
        title: "",
        titleSubhead: "",
        description: "",
        discount: 1,
        xcredit: 1,
        expiryDate: dayjs(Date.now()),
    });

    useEffect(() => {
        http.get(`/rewards/${id}`).then((res) => {
            setrewards(res.data);
            setImageFile(res.data.imageFile);
        });
    }, []);

    

    const [categoryValue, setcategoryValue] = useState("");

    const category = ["Event", "Holiday"];

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: rewards,
        validationSchema: yup.object().shape({
            header: yup.string().trim().min(3).max(100).required(),
            category: yup.string().trim().min(3).max(100).required(),
            title: yup.string().trim().min(3).max(100).required(),
            titleSubhead: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(100).required(),
            discount: yup
                .number("Discount input must be a number!")
                .moreThan(1, "Discount must be at least 1%")
                .lessThan(100.01, "Discount must be at most 100%")
                .positive()
                .required(),
            xcredit: yup.number().moreThan(-1).positive().required(),
            expiryDate: yup
                .date()
                .min(new Date(), "Expiry Date must be in the future!")
                .required(),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            console.log(data);
            http.put(`/rewards/${id}`, data).then((res) => {
                console.log(res.data);
                navigate("/admin/rewards");
            });
        },
    });
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        formik.values.category = value;
        setcategoryValue(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const [isHover, setIsHover] = useState(true);

    const handleHoverFile = () => {
        setIsHover(true);
    };

    const handleLeaveHoverFile = () => {
        setIsHover(false);
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteRewards = () => {
        http.delete(`/rewards/${id}`).then((res) => {
            console.log(res.data);
            navigate("/admin/rewards");
        });
    };

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
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <NavContainer>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        cursor: "pointer",
                    }}
                >
                    <Typography variant="h2">Update rewards</Typography>
                    <Typography
                        variant="body1"
                        color="secondary"
                        onClick={onClickCancel}
                        mt={3}
                    >
                        🠔 Back to rewards
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                    }}
                    mt={5}
                >
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            bgcolor: deepPurple[50],
                            padding: 4,
                            width: ["80%", "65%", "60%"],
                            borderRadius: 4,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                minHeight: 110,
                                py: 2,
                                border: 1,
                                borderStyle: "dashed",
                                bgcolor: "#E0DAEA",
                                borderRadius: 2,
                            }}
                        >
                            {imageFile == null ? (
                                <Typography px={3}>
                                    Drop image file here, or click below
                                </Typography>
                            ) : (
                                <Typography
                                    px={3}
                                    variant="body1"
                                    color="initial"
                                >
                                    Rewards Image
                                </Typography>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 2,
                                }}
                            >
                                {/* {imageFile != null && isHover && (
                                    
                                )} */}
                                <Button
                                    variant="contained"
                                    component="label"
                                    color="inherit"
                                    startIcon={<UploadIcon />}
                                    sx={{
                                        position:
                                            imageFile != null && isHover
                                                ? "absolute"
                                                : "",
                                        zIndex: 100,
                                        display:
                                            imageFile == null
                                                ? "flex"
                                                : isHover
                                                ? "flex"
                                                : "none",
                                    }}
                                    onMouseOver={handleHoverFile}
                                    onMouseLeave={handleLeaveHoverFile}
                                >
                                    Upload Image
                                    <input
                                        id="image_file"
                                        name="image_file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Card
                                    sx={{
                                        width: 500,
                                        opacity: imageFile != null ? 1 : 0,
                                        // height: "100"
                                    }}
                                    onMouseOver={handleHoverFile}
                                    onMouseLeave={handleLeaveHoverFile}
                                >
                                    <CardMedia
                                        sx={{
                                            height: imageFile != null ? 260 : 0,
                                            opacity: !isHover ? 1 : 0.8,
                                        }}
                                        image={`${
                                            import.meta.env.VITE_FILE_BASE_URL
                                        }${imageFile}`}
                                    />
                                </Card>
                            </Box>
                        </Box>
                        <TextField
                            variant="filled"
                            fullWidth
                            margin="normal"
                            label="Rewards header"
                            name="header"
                            value={formik.values.header}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.header &&
                                Boolean(formik.errors.header)
                            }
                            helperText={
                                formik.touched.header && formik.errors.header
                            }
                        />
                        <TextField
                            select
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Select category"
                            name="select"
                            placeholder=""
                            value={formik.values.category}
                            onChange={handleChange}
                            error={
                                formik.touched.category &&
                                Boolean(formik.errors.category)
                            }
                            helperText={
                                formik.touched.category &&
                                formik.errors.category
                            }
                            variant="filled"
                        >
                            {category.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            variant="filled"
                            fullWidth
                            margin="normal"
                            multiline
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.title &&
                                Boolean(formik.errors.title)
                            }
                            helperText={
                                formik.touched.title && formik.errors.title
                            }
                        />
                        <TextField
                            variant="filled"
                            fullWidth
                            margin="normal"
                            multiline
                            label="Title Subhead"
                            name="titleSubhead"
                            value={formik.values.titleSubhead}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.titleSubhead &&
                                Boolean(formik.errors.titleSubhead)
                            }
                            helperText={
                                formik.touched.titleSubhead &&
                                formik.errors.titleSubhead
                            }
                        />
                        <TextField
                            variant="filled"
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.description &&
                                Boolean(formik.errors.description)
                            }
                            helperText={
                                formik.touched.description &&
                                formik.errors.description
                            }
                        />
                        <TextField
                            variant="filled"
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            multiline
                            label="Discount (%)"
                            name="discount"
                            value={formik.values.discount}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.discount &&
                                Boolean(formik.errors.discount)
                            }
                            helperText={
                                formik.touched.discount &&
                                formik.errors.discount
                            }
                        />
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                mt: 2,
                            }}
                        >
                            <Box sx={{ width: "50%" }}>
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    autoComplete="off"
                                    label="XCredit"
                                    name="xcredit"
                                    value={formik.values.xcredit}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.xcredit &&
                                        Boolean(formik.errors.xcredit)
                                    }
                                    helperText={
                                        formik.touched.xcredit &&
                                        formik.errors.xcredit
                                    }
                                />
                            </Box>
                            <Box sx={{ width: "50%" }}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#DCD6E6",
                                        }}
                                        label="Expiry Date"
                                        name="expiryDate"
                                        value={dayjs(formik.values.expiryDate)}
                                        onChange={(value) => {
                                            formik.setFieldValue(
                                                "expiryDate",
                                                Date.parse(value)
                                            );
                                        }}
                                        error={
                                            formik.touched.expiryDate &&
                                            Boolean(formik.errors.expiryDate)
                                        }
                                        helperText={
                                            formik.touched.expiryDate &&
                                            formik.errors.expiryDate
                                        }
                                    ></DatePicker>
                                </LocalizationProvider>
                            </Box>
                        </Box>

                        <Box
                            mt={2}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                            }}
                        >
                            <Button onClick={onClickCancel}>
                                <Typography variant="button" color="error">
                                    cancel
                                </Typography>
                            </Button>
                            <Button type="submit">
                                <Typography variant="button" color="warning">
                                    Update rewards
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        my: 5,
                        width: ["95%", "87%", "73vw"],
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        variant="contained"
                        component="label"
                        color="error"
                        startIcon={
                            <DeleteIcon
                                color="primary"
                                fontSize="large"
                                style={{ color: "black" }}
                            />
                        }
                        onClick={handleOpen}
                    >
                        Delete rewards
                    </Button>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle> Delete Rewards </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this reward?
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
                            onClick={deleteRewards}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </NavContainer>
    );
}

export default EditRewards;
