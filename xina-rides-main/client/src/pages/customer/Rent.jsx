import React, { useState, useEffect } from "react";
import http from "../../http";
import {
    MapWrapper,
    BikeLayer,
    MapSideBar,
    Navbar,
    getCurrentLocation,
    MapCenterController,
    PositionMarker,
    TrafficIncidentLayer,
} from "../../components";
import { LayersControl } from "react-leaflet";
import { Box } from "@mui/material";

function Map() {
    const [bikeList, setBikeList] = useState([]);
    const [trafficIncidents, setTrafficIncidents] = useState([]);
    const [trainServiceAlerts, setTrainServiceAlerts] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

    const getBikes = () => {
        http.get("/bike/rentable").then((res) => {
            setBikeList(res.data);
        });
    };

    const getTrafficIncidents = () => {
        http.get("/ptstatus/TrafficIncidents").then((res) => {
            setTrafficIncidents(res.data);
        });
    };

    const getTrainServiceAlerts = () => {
        http.get("/ptstatus/TrainServiceAlerts").then((res) => {
            setTrainServiceAlerts(res.data);
        });
    };

    useEffect(() => {
        document.title = "Rent a Bike | XinaRides";
        getBikes();
        getTrafficIncidents();
        getTrainServiceAlerts();
        getCurrentLocation().then((coords) => {
            setCurrentLocation([coords.latitude, coords.longitude]);
        });
    }, []);

    return (
        <>
            <Navbar />
            <Box sx={{ display: "flex", overflow: "hidden" }}>
                <MapSideBar
                    trafficIncidents={trafficIncidents}
                    trainServiceAlerts={trainServiceAlerts.Message}
                />
                <MapWrapper
                    center={[1.3609, 103.81169]}
                    scrollWheelZoom={true}
                    style={{
                        width: "100vw",
                    }}
                >
                    <PositionMarker pos={currentLocation} />
                    <MapCenterController center={currentLocation} zoom={15} />
                    <LayersControl>
                        <LayersControl.Overlay checked name="Bikes">
                            <BikeLayer key="bike-layer" bikes={bikeList} />
                        </LayersControl.Overlay>

                        <LayersControl.Overlay checked name="Traffic Incidents">
                            <TrafficIncidentLayer
                                trafficIncidents={trafficIncidents}
                            />
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapWrapper>
            </Box>
        </>
    );
}

export default Map;
