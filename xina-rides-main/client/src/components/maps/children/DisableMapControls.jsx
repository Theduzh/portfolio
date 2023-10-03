import L from "leaflet";
import { useMap } from "react-leaflet";

function DisableMapControls() {
    let map = useMap();

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.zoomControl.remove();

    return <></>;
}

export default DisableMapControls;
