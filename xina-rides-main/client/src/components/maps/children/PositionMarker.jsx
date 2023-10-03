import posMarkerIcon from "../icons/posMarker";
import { Marker, Tooltip } from "react-leaflet";

function PositionMarker({ pos = null }) {
    if (pos !== null) {
        return (
            <Marker position={pos} icon={posMarkerIcon}>
                <Tooltip>You are here.</Tooltip>
            </Marker>
        );
    } else {
        console.warn("PositionMarker: pos? is null");
        return <></>;
    }
}

export default PositionMarker;
