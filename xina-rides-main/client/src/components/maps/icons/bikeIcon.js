import L from "leaflet";
import bikeMapPin from "../../../assets/bikeMapPin.svg";
import "./bikeMapPin.css";

let bikeIcon = L.icon({
    iconUrl: bikeMapPin,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    className: "leaflet-marker-shadow",
});

export default bikeIcon;
