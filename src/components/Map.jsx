import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  // Catch the Global variable
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  //Change the searchParams, we need to pass in brand new object to the setSearchParams and then set the new value there (with the complete properties)
  //  <button onClick={() => setSearchParams({ lat: 25, lng: 90 })}>
  //       Change the SearchParams
  //  </button>

  return (
    <div className={styles.mapContainer}>
      <h1>Map</h1>
      <h1>
        Postiton {lat} , {lng}
      </h1>
      <button onClick={() => setSearchParams({ lat: 25, lng: `${lng}` })}>
        Change the SearchParams
      </button>
    </div>
  );
}

export default Map;
