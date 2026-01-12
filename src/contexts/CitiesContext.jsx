import { control } from "leaflet";
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:9000/cities";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "cities/loaded":
      return {
        ...state,
        isLoading: true,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/received":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/received":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      throw new Error("Unknown action:", action.type);
  }
};

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        dispatch({ type: "cities/loaded" });
        const res = await fetch(`${BASE_URL}`);
        const data = await res.json();
        dispatch({ type: "cities/received", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities..",
        });
      }
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (currentCity.id === id) return;

      try {
        dispatch({ type: "city/loaded" });
        const res = await fetch(`${BASE_URL}/${id}`);
        const data = await res.json();
        dispatch({ type: "city/received", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading city..",
        });
      }
    },
    [currentCity.id]
  );

  const createCity = async (newCity) => {
    try {
      dispatch({ type: "city/loaded" });
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // This is optional, as after adding the new city, we do not make any request to the API so we need to manually refresh the page.
      // To avoid this behavior, we want to re-render the page so we keep the cities in sync with the data that we've just submit.
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city..",
      });
    }
  };

  const deleteCity = async (id) => {
    try {
      dispatch({ type: "city/loaded" });
      // We don't have to store the deleted value
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      // As after deleting the new city, we do not make any request to the API so we need to manually refresh the page.
      // To avoid this behavior, we want to re-render the page so we keep the cities in sync with the data that we've just submit.
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city..",
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the cities provider");

  return context;
}

export { CitiesProvider, useCities };
