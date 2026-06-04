import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ FIX marker issue (place HERE, outside component)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RunMap({ path }) {
  if (!path.length) return <p>No route data</p>;

  const positions = path.map((p) => [p.lat, p.lon]);

  return (
    <MapContainer
      center={positions[0]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={positions} color="blue" />

      <Marker position={positions[0]} />
      <Marker position={positions[positions.length - 1]} />
    </MapContainer>
  );
}

export default RunMap;