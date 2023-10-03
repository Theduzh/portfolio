import L from "leaflet";
import posMarker from "../../../assets/blue-circle-pos-marker.png";

let posMarkerIcon = L.icon({
    iconUrl: posMarker,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

export default posMarkerIcon;
