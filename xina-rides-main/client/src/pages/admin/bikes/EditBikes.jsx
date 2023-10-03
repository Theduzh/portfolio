import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import http from "../../../http";
import { useFormik } from "formik";
import { LocationPicker, NavContainer } from "../../../components";
import * as yup from "yup";

function EditBikes() {
    const { bikeId } = useParams();
    const navigate = useNavigate();

    const [bike, setBike] = useState({
        name: "",
        currentlyInUse: false,
        rentalPrice: 0,
        condition: "",
        bikeId: "",
        bikeLon: 0,
        bikeLat: 0,
        updatedAt: "",
        createdAt: "",
    });

    useEffect(() => {
        document.title = "Edit Bikes | XinaRides";
        http.get(`/bike/${bikeId}`).then((res) => {
            setBike(res.data);
            setMarkerPos([Number(res.data.bikeLat), Number(res.data.bikeLon)]);
        });
    }, []);

    const [markerPos, _setMarkerPos] = useState([1.3146, 103.8454]);

    const setMarkerPos = (loc) => {
        _setMarkerPos(loc);
        console.log(loc.lat, loc.lng);
        formik.setFieldValue("bikeLat", loc.lat);
        formik.setFieldValue("bikeLon", loc.lng);
    };

    const formik = useFormik({
        initialValues: bike,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            // bikeId: yup.string().when("bikeId", (value) => {
            //     if (value != undefined || value != null) {
            //         return yup
            //             .string()
            //             .min(BikeIdLength + 1)
            //             .max(BikeIdLength + 1)
            //             .matches(/B[\d]+$/);
            //     }
            // }),
            name: yup.string().trim().min(3).max(100).required(),
            currentlyInUse: yup.bool().required(),
            rentalPrice: yup
                .number()
                .moreThan(0)
                .lessThan(1000)
                .positive()
                .required(),
            condition: yup.string().max(10000),
            bikeLat: yup
                .number()
                .moreThan(-90)
                .lessThan(90)
                .optional()
                .nullable(true),
            bikeLon: yup
                .number()
                .moreThan(-180)
                .lessThan(180)
                .optional()
                .nullable(true),
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.currentlyInUse = data.currentlyInUse === "true"; // convert to bool
            data.rentalPrice = Number(data.rentalPrice);
            if (
                !(data.bikeLat || data.bikeLat == 0) ||
                !(data.bikeLon || data.bikeLon == 0)
            ) {
                data.bikeLat = oldLatLng[0];
                data.bikeLon = oldLatLng[1];
            } else {
                data.bikeLat = Number(data.bikeLat);
                data.bikeLon = Number(data.bikeLon);
            }

            http.put(`/bike/${bikeId}`, data).then((res) => {
                console.log(res.data);
                navigate("/admin/bikes");
            });
        },
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteBike = () => {
        http.delete(`/bike/${bikeId}`).then((res) => {
            console.log(res.data);
            navigate("/admin/bikes");
        });
    };

    return (
        <NavContainer>
            <Box>
                <Typography variant="h3" fontSize={36}>
                    Bikes
                </Typography>
                <Typography
                    variant="p"
                    fontSize={16}
                    fontWeight={"medium"}
                    sx={{ color: "#79747E" }}
                >
                    All Bikes {">"} Edit Bike
                </Typography>
                <Box
                    component="form"
                    sx={{ mx: 2 }}
                    onSubmit={formik.handleSubmit}
                >
                    <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        autoComplete="off"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <FormControl
                        sx={{ m: 3 }}
                        error={Boolean(formik.errors.currentlyInUse)}
                        variant="standard"
                    >
                        <FormLabel id="inuse-radio">Is bike in use?</FormLabel>
                        <RadioGroup
                            aria-labelledby="inuse-radio"
                            name="currentlyInUse"
                            value={formik.values.currentlyInUse}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        autoComplete="off"
                        label="Rental Price Per Hour"
                        name="rentalPrice"
                        value={formik.values.rentalPrice}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.rentalPrice &&
                            Boolean(formik.errors.rentalPrice)
                        }
                        helperText={
                            formik.touched.rentalPrice &&
                            formik.errors.rentalPrice
                        }
                    />
                    <TextField
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        autoComplete="off"
                        label="Bike Condition (optional)"
                        name="condition"
                        value={formik.values.condition}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.condition &&
                            Boolean(formik.errors.condition)
                        }
                        helperText={
                            formik.touched.condition && formik.errors.condition
                        }
                    />

                    <Typography>Location of Bike: </Typography>
                    <LocationPicker
                        selectedPos={markerPos}
                        setSelectedPosState={setMarkerPos}
                        scrollWheelZoom={true}
                        style={{ width: "50vh", height: "50vh" }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ ml: 2 }}
                            color="error"
                            onClick={handleOpen}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Delete bike</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this bike?
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
                            onClick={deleteBike}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </NavContainer>
    );
}

export default EditBikes;
