import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http";
import {
    NavContainer,
    LocationPicker,
    getCurrentLocation,
} from "../../../components";

function AddBike() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            currentlyInUse: "",
            rentalPrice: "",
            condition: "",
            locationX: "",
            locationY: "",
        },
        validationSchema: yup.object().shape({
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
                data.bikeLat = currentLatLng[0];
                data.bikeLon = currentLatLng[1];
            } else {
                data.bikeLat = Number(data.bikeLat);
                data.bikeLon = Number(data.bikeLon);
            }

            http.post("/bike/add", data).then((res) => {
                console.log(res.data);
                navigate("/admin/bikes");
            });
        },
    });

    const currentLatLng = [1.3146, 103.8454];
    const [markerPos, _setMarkerPos] = useState(currentLatLng);

    useEffect(() => {
        document.title = "Add a New Bike | XinaRides";
        getCurrentLocation().then((coords) =>
            _setMarkerPos([coords.latitude, coords.longitude])
        );
    }, []);

    const setMarkerPos = (loc) => {
        _setMarkerPos(loc);
        formik.setFieldValue("bikeLat", loc.lat);
        formik.setFieldValue("bikeLon", loc.lng);
    };

    return (
        <NavContainer>
            <Box sx={{ p: 7.5, width: "100%" }}>
                <Typography variant="h3" fontSize={36}>
                    Add Bike
                </Typography>
                <Typography
                    variant="p"
                    fontSize={16}
                    fontWeight={"medium"}
                    sx={{ color: "#79747E" }}
                >
                    All Bikes {">"} Add Bike
                </Typography>
                <Box
                    component="form"
                    sx={{ mx: 2 }}
                    onSubmit={formik.handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth
                                margin="normal"
                                autoComplete="off"
                                label="Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.name &&
                                    Boolean(formik.errors.name)
                                }
                                helperText={
                                    formik.touched.name && formik.errors.name
                                }
                            />
                            <FormControl
                                sx={{ m: 3 }}
                                error={Boolean(formik.errors.currentlyInUse)}
                                variant="standard"
                            >
                                <FormLabel id="inuse-radio">
                                    Is bike in use?
                                </FormLabel>
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
                                    formik.touched.condition &&
                                    formik.errors.condition
                                }
                            />

                            <Typography>Location of Bike: </Typography>
                            <LocationPicker
                                selectedPos={markerPos}
                                setSelectedPosState={setMarkerPos}
                                scrollWheelZoom={true}
                                style={{ width: "50vh", height: "50vh" }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Add
                        </Button>
                    </Box>
                </Box>
            </Box>
        </NavContainer>
    );
}

export default AddBike;
