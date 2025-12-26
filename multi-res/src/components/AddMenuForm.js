import axios from "axios";
import { useState } from "react";

function AddMenuForm({ hotelId, onMenuAdded }) {
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");      // plain text input
  const [price, setPrice] = useState("");

  const handleAddMenu = async (e) => {
    e.preventDefault();

    if (parseFloat(price) <= 0) {
      alert("❌ Price must be greater than 0");
      return;
    }

    try {
      // Simple JSON body (no multipart now)
      const payload = {
        foodName,
        category,
        price: parseFloat(price)
      };

      await axios.post(
        `http://localhost:8080/api/hotels/${hotelId}/menu`,
        payload
      );

      alert("✅ Menu item added!");
      setFoodName("");
      setCategory("");
      setPrice("");
      if (onMenuAdded) onMenuAdded();
    } catch (err) {
      console.error("❌ Failed to add menu:", err);
      alert("❌ Error adding menu item");
    }
  };

  return (
    <form className="hotelmenu-order-form" onSubmit={handleAddMenu}>
      <h3>➕ Add New Menu Item</h3>

      <input
        type="text"
        placeholder="Food Name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        required
      />

      {/* ✏️ Category as free-text */}
      <input
        type="text"
        placeholder="Category (e.g. Veg / Non-Veg / Chinese …)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min="1"
      />

      <button type="submit" className="hotelmenu-submit-btn">
        ✅ Add Item
      </button>
    </form>
  );
}

export default AddMenuForm;








/*import axios from "axios";
import { useState } from "react";

function AddMenuForm({ hotelId, onMenuAdded }) {
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/hotels/${hotelId}/menu`, {
        foodName,
        category,
        price: parseFloat(price)
      });
      alert("✅ Menu item added!");
      setFoodName(""); setCategory(""); setPrice("");
      onMenuAdded(); // refresh hotel data
    } catch (err) {
      console.error("❌ Failed to add menu:", err);
      alert("❌ Error adding menu item");
    }
  };

  return (
    <form className="hotelmenu-order-form" onSubmit={handleAddMenu}>
      <h3>➕ Add New Menu Item</h3>
      <input 
        type="text" 
        placeholder="Food Name" 
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Category (Veg/NonVeg)" 
        value={category}
        onChange={(e) => setCategory(e.target.value)} 
        required 
      />
      <input 
        type="number" 
        placeholder="Price" 
        value={price}
        onChange={(e) => setPrice(e.target.value)} 
        required 
      />
      <button type="submit" className="hotelmenu-submit-btn">✅ Add Item</button>
    </form>
  );
}

export default AddMenuForm;*/
