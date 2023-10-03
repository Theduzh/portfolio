import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Grid } from "@mui/material";
import { MapWrapper, LocationPicker, BikeLayer } from "../../components";
import http from "../../http";
import "leaflet/dist/leaflet.css";

function TestMap() {
    const [searchParams, setSearchParams] = useSearchParams();
    let lat = searchParams.get("lat");
    let lng = searchParams.get("lng");

    if (!lat || !lng) {
        // Singapore
        lat = 1.31;
        lng = 103.8;
    }
    let center = [lat, lng];
    let zoom = 15;
    let style = {
        height: "70vh",
        width: "70vw",
    };
    let multipleMarkers = [
        { latLng: [1.3152, 103.8041], message: "Test 2" },
        { latLng: [1.3088, 103.7999], message: "Test 3" },
    ];

    let [selPos, setSelPos] = useState(center);

    const [bikeList, setBikeList] = useState([]);

    const getBikes = () => {
        http.get("/bike").then((res) => {
            setBikeList(res.data);
        });
    };

    useEffect(() => {
        getBikes();
    }, []);

    console.log(bikeList);

    return (
        <>
            <Typography variant="h5" sx={{ my: 2, mx: 2 }}>
                Map Tester
            </Typography>
            <Grid container alignContent="center" justifyContent="center">
                <MapWrapper
                    center={center}
                    zoom={zoom}
                    style={style}
                    scrollWheelZoom={true}
                    layers={[<BikeLayer bikes={bikeList} />]}
                />
                {/* <LocationPicker
                    selectedPos={selPos}
                    setSelectedPosState={setSelPos}
                    style={style}
                /> */}
            </Grid>
        </>
    );
}

export default TestMap;
