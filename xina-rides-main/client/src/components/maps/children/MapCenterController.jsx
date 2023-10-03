import { useMap } from "react-leaflet";

function MapCenterController({ center, zoom = 10 }) {
    const map = useMap();

    if (center !== null) {
        map.flyTo(center, zoom);
    }
    return <></>;
}

export default MapCenterController;
