import { CircleMarker, LayerGroup, Tooltip } from "react-leaflet";

function TrafficIncidentLayer({ trafficIncidents }) {
    return (
        <LayerGroup>
            {trafficIncidents.map((incident, index) => (
                <CircleMarker
                    center={[incident.Latitude, incident.Longitude]}
                    pathOptions={{ color: "red" }}
                    radius={5}
                    key={index}
                >
                    <Tooltip>{incident.Type + ": " + incident.Message}</Tooltip>
                </CircleMarker>
            ))}
        </LayerGroup>
    );
}

export default TrafficIncidentLayer;
