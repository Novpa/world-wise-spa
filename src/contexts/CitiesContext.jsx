import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:9000/cities";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was an error loading data..");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There was an error getting data..");
    } finally {
      setIsLoading(false);
    }
  };

  const createCity = async (newCity) => {
    try {
      setIsLoading(true);
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
      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was an error creating data..");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCity = async (id) => {
    try {
      setIsLoading(true);

      // We don't have to store the deleted value
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      // This is optional, as after deleting the new city, we do not make any request to the API so we need to manually refresh the page.
      // To avoid this behavior, we want to re-render the page so we keep the cities in sync with the data that we've just submit.
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deleting data..");
    } finally {
      setIsLoading(false);
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
      }}
    >
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
