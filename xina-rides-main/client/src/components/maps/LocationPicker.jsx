import { Marker } from "react-leaflet";
import { useRef, useMemo } from "react";
import { MapWrapper, MapCenterController } from "../../components";
import "leaflet/dist/leaflet.css";

function LocationPicker({
    selectedPos,
    setSelectedPosState,
    style,
    zoom = 15,
    scrollWheelZoom = false,
}) {
    const markerRef = useRef(null);

    let eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    setSelectedPosState(marker.getLatLng());
                }
            },
        }),
        []
    );

    return (
        <MapWrapper
            center={selectedPos}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            style={style}
        >
            <Marker
                draggable={true}
                position={selectedPos}
                eventHandlers={eventHandlers}
                ref={markerRef}
            />
            <MapCenterController center={selectedPos} zoom={zoom} />
        </MapWrapper>
    );
}

export default LocationPicker;
