 
  // src/components/HotelList.jsx

import { useEffect, useState } from "react";
import API from "../api";
import "./HotelList.css";
import HotelMenu from "./HotelMenu";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      

const res = await API.get("/hotels");

      setHotels(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotel-list-container">

      {/* Beautiful Animated Title */}
      {!selectedHotelId && (
        <h1 className="hotel-title">
          Available Hotels
          <span className="title-underline"></span>
        </h1>
      )}

      {/* List Section */}
      {!selectedHotelId ? (
        loading ? (
          <div className="shimmer-container">
            {[1, 2, 3].map((x) => (
              <div key={x} className="shimmer-card"></div>
            ))}
          </div>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="hotel-card advanced-anim"
                onClick={() => setSelectedHotelId(hotel.id)}
              >
                <div className="hotel-header">
                  <div className="hotel-badge">
                    🍽️
                  </div>
                  <h2>{hotel.hotelName}</h2>
                </div>

                <p><strong>📍 Location:</strong> {hotel.location}</p>
                <p><strong>⭐ Specialization:</strong> {hotel.specialization}</p>

                <button className="view-btn">View Menu</button>
              </div>
            ))}
          </div>
        )
      ) : (
        <HotelMenu
          hotelId={selectedHotelId}
          onBack={() => setSelectedHotelId(null)}
        />
      )}
    </div>
  );
}

export default HotelList;
























/*import axios from "axios";
import { useEffect, useState } from "react";
import "./HotelList.css";
import HotelMenu from "./HotelMenu"; // Import new component

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/hotels");
      setHotels(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotel-list">
      {/* Agar koi hotel select nahi hua to list dikhaye /}
      {!selectedHotelId && <h1>Available Hotels</h1>}

      {!selectedHotelId ? (
        loading ? (
          <p>Loading hotels...</p>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <h2>{hotel.hotelName}</h2>
                <p><strong>Location:</strong> {hotel.location}</p>
                <p><strong>Specialization:</strong> {hotel.specialization}</p>
                <button onClick={() => setSelectedHotelId(hotel.id)}>View Menu</button>
              </div>
            ))}
          </div>
        )
      ) : (
        <HotelMenu 
          hotelId={selectedHotelId} 
          onBack={() => setSelectedHotelId(null)} // back button handler
        />
      )}
    </div>
  );
}

export default HotelList;*/















