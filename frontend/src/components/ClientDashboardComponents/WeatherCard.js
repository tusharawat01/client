import { useEffect, useState } from "react";
import axios from "axios";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);

  const getCurrentCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  const fetchWeather = async () => {
    // const {latitude,longitude} = await getCurrentCoordinates();
    const latitude = 9.9016102;
    const longitude = 78.1212731;
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=cf259dc5444ca0c3f9ef2676b45aff6d&units=metric`
    );
    setWeatherData(data);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-full mx-auto p-6 pt-4 bg-white hover:bg-gray-200/10 transition-all 
    duration-200 ease-in-out cursor-pointer rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {Math.round(weatherData?.list[0]?.main?.temp)}°C
          </h2>
          <p className="text-gray-600">
            {weatherData?.city?.name}, {weatherData?.city?.country}
          </p>
        </div>
        <div>
          <img
            src={`/icons/${weatherData?.list[0]?.weather[0].icon}.png`}
            alt="today"
            className="w-[86px] h-[86px]"
          />
        </div>
      </div>
      <div className="mt-4 flex xl:gap-11 md:gap-9 gap-7 scrollbar-none overflow-x-scroll justify-between">
        {weatherData?.list?.map((day, index) => (
          <div key={index} className="text-center">
            <p>{Math.round(day.main.temp)}°C</p>
            <img
              src={`/icons/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="w-8 h-8 mx-auto"
            />
            <p className="text-gray-700 text-sm">
              {
                new Date(day.dt * 1000)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  ?.split(" ")[0]
              }
            </p>
            <p className="text-gray-500 font text-xs">
              {
                new Date(day.dt * 1000)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  ?.split(" ")[1]
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
