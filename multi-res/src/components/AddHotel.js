import { useState } from "react";

const AddHotel = () => {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hotelData = { hotelName, location, specialization };

    try {
      const response = await fetch("http://localhost:8080/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hotelData)
      });

      if (!response.ok) {
        throw new Error("Failed to save hotel");
      }

      alert("Hotel added successfully");
      setHotelName("");
      setLocation("");
      setSpecialization("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "10px" }}>
      <h2>Add New Hotel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Hotel</button>
      </form>
    </div>
  );
};

export default AddHotel;
