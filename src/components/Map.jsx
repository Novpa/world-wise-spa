import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import styles from "./Map.module.css";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();

  // Catch the Global variable
  const [mapLat, mapLng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  // console.log(mapLat, mapLng);

  //Change the searchParams, we need to pass in brand new object to the setSearchParams and then set the new value there (with the complete properties)
  //  <button onClick={() => setSearchParams({ lat: 25, lng: 90 })}>
  //       Change the SearchParams
  //  </button>

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  // Use to set the mapPosition to the current user's position whenever the user click Button "Use your position"
  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// This will center the map everytime we click to different location in the map
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

// This will return the data that is clicked by the user
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      // console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      // This will navigate/change the link with global data {lat & lng} -> change the {mapLat & mapLng} -> triggers the useEffect -> change mapPosition thru setMapPosition inside of th useEffect -> triggers the <ChangeCenter /> to center the map to the clicked position

      //If we are using only navigate(`form`), this only pop up the Form without centering the map;
    },
  });
}

export default Map;
