import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RunMap({ path }) {
  const defaultCenter = [26.7271, 88.3953];

  const currentPosition =
    path.length > 0
      ? path[path.length - 1]
      : defaultCenter;

  return (
    <MapContainer
      center={currentPosition}
      zoom={16}
      style={{
        height: "400px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {path.length > 1 && (
        <Polyline
          positions={path}
          color="blue"
        />
      )}

      {path.length > 0 && (
        <Marker
          position={currentPosition}
        />
      )}
    </MapContainer>
  );
}

export default RunMap;