import bikeIcon from "../icons/bikeIcon";
import { LayerGroup, Marker, Tooltip } from "react-leaflet";

function BikeLayerNoCheckoutLogic({ bikes }) {
    return (
        <LayerGroup>
            {bikes.map((bike) => {
                return (
                    <Marker
                        position={[bike.bikeLat, bike.bikeLon]}
                        icon={bikeIcon}
                        key={bike.bikeId}
                    >
                        <Tooltip>{bike.name}</Tooltip>
                    </Marker>
                );
            })}
        </LayerGroup>
    );
}

export default BikeLayerNoCheckoutLogic;
