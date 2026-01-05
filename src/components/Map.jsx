import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();

  // Catch the Global variable
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  //Change the searchParams, we need to pass in brand new object to the setSearchParams and then set the new value there (with the complete properties)
  //  <button onClick={() => setSearchParams({ lat: 25, lng: 90 })}>
  //       Change the SearchParams
  //  </button>

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={mapPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
