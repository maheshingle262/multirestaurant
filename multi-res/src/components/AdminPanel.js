import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminPanel.css';

function AdminPanel({ setActivePanel, fetchHotels }) {
  // ===== Food Item State =====
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ===== Hotel State =====
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/hotels')
      .catch(err => console.error(err));
  }, []);

  // ===== Add Food Item =====
  const handleFoodSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !category || !price) {
      alert('Please fill all food fields');
      return;
    }

    const orderItem = {
      foodName,
      category,
      price: parseInt(price),
      quantity: parseInt(quantity),
    };

    const kitchenModel = {
      customerName: 'Owner Menu',
      address: 'N/A',
      contact: '0000000000',
      items: [orderItem],
      total: parseInt(price),
      status: 'MenuItem',
    };

    try {
      await axios.post('http://localhost:8080/api/order', kitchenModel, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Item added to menu successfully!');
      setFoodName('');
      setCategory('');
      setPrice('');
      setQuantity(1);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  // ===== Add Hotel =====
  const handleHotelSubmit = async (e) => {
    e.preventDefault();

    if (!hotelName || !hotelLocation || !specialization) {
      alert('Please fill all hotel fields');
      return;
    }

    const newHotel = {
      hotelName,
      location: hotelLocation,
      specialization,
    };

    try {
      await axios.post('http://localhost:8080/api/hotels', newHotel, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Hotel added successfully!');
      setHotelName('');
      setHotelLocation('');
      setSpecialization('');

      if (typeof fetchHotels === 'function') {
        fetchHotels();
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('Failed to save hotel');
    }
  };

  return (
    <div className="admin-panels-container" style={{ display: 'flex', gap: '2rem' }}>

      {/* ===== Add Food Item Form ===== */}
      <div className="admin-form-container">
        <h2>Add New Food Item</h2>
        <form onSubmit={handleFoodSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Main Course">Main Course</option>
            <option value="Combo">Combo</option>
            <option value="Thali">Thali</option>
            <option value="Paratha">Paratha</option>
            <option value="Pulao">Pulao</option>
            <option value="Extra">Extra</option>
            <option value="Roti">Roti</option>
            <option value="Rice">Rice</option>
          </select>
          <input
            type="number"
            placeholder="Price ₹"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>

      {/* ===== Add Hotel Form =====*/}
      <div className="admin-form-container">
        <h2>Add New Hotel</h2>
        <form onSubmit={handleHotelSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Hotel Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={hotelLocation}
            onChange={(e) => setHotelLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <button type="submit">Add Hotel</button>
        </form>
      </div>

      {/* === The third "Add Menu Item" form has been removed === */}

    </div>
  );
}

export default AdminPanel;


















/*

import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminPanel.css';

function AdminPanel({ setActivePanel, fetchHotels }) {
  // ===== Food Item State =====
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ===== Hotel State =====
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [specialization, setSpecialization] = useState('');

  // ===== Add Menu Item State =====
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [menuItem, setMenuItem] = useState({
    foodName: '',
    category: '',
    price: ''
  });

  // ===== Load Hotels for Menu Dropdown =====
  useEffect(() => {
    axios.get('http://localhost:8080/api/hotels')
      .then(res => setHotels(res.data))
      .catch(err => console.error(err));
  }, []);

  // ===== Add Food Item =====
  const handleFoodSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !category || !price) {
      alert('Please fill all food fields');
      return;
    }

    const orderItem = {
      foodName,
      category,
      price: parseInt(price),
      quantity: parseInt(quantity),
    };

    const kitchenModel = {
      customerName: 'Owner Menu',
      address: 'N/A',
      contact: '0000000000',
      items: [orderItem],
      total: parseInt(price),
      status: 'MenuItem',
    };

    try {
      await axios.post('http://localhost:8080/api/order', kitchenModel, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Item added to menu successfully!');
      setFoodName('');
      setCategory('');
      setPrice('');
      setQuantity(1);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  // ===== Add Hotel =====
  const handleHotelSubmit = async (e) => {
    e.preventDefault();

    if (!hotelName || !hotelLocation || !specialization) {
      alert('Please fill all hotel fields');
      return;
    }

    const newHotel = {
      hotelName,
      location: hotelLocation,
      specialization,
    };

    try {
      await axios.post('http://localhost:8080/api/hotels', newHotel, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Hotel added successfully!');
      setHotelName('');
      setHotelLocation('');
      setSpecialization('');

      if (typeof fetchHotels === 'function') {
        fetchHotels();
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('Failed to save hotel');
    }
  };

  // ===== Add Menu Item =====
  const handleMenuChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    if (!selectedHotel) {
      alert("Please select a hotel");
      return;
    }

    fetch(`http://localhost:8080/api/hotels/${selectedHotel}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodName: menuItem.foodName,
        category: menuItem.category,
        price: parseInt(menuItem.price)
      })
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        setMenuItem({ foodName: "", category: "", price: "" });
      });
  };

  return (
    <div className="admin-panels-container" style={{ display: 'flex', gap: '2rem' }}>

      {/* ===== Add Food Item Form ===== /}
      <div className="admin-form-container">
        <h2>Add New Food Item</h2>
        <form onSubmit={handleFoodSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Main Course">Main Course</option>
            <option value="Combo">Combo</option>
            <option value="Thali">Thali</option>
            <option value="Paratha">Paratha</option>
            <option value="Pulao">Pulao</option>
            <option value="Extra">Extra</option>
            <option value="Roti">Roti</option>
            <option value="Rice">Rice</option>
          </select>
          <input
            type="number"
            placeholder="Price ₹"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>

      {/* ===== Add Hotel Form =====/}
      <div className="admin-form-container">
        <h2>Add New Hotel</h2>
        <form onSubmit={handleHotelSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Hotel Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={hotelLocation}
            onChange={(e) => setHotelLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <button type="submit">Add Hotel</button>
        </form>
      </div>

      {/* ===== Add Menu Item Form ===== /}
        <div className="admin-form-container">
  <h2>Add Menu Item</h2>
  <form onSubmit={handleMenuSubmit} className="admin-form">
    <select
      value={selectedHotel}
      onChange={(e) => setSelectedHotel(e.target.value)}
    >
      <option value="">-- Select Hotel --</option>
      {hotels.map((hotel) => (
        <option key={hotel.id} value={hotel.id}>
          {hotel.hotelName}
        </option>
      ))}
    </select>

    <input
      type="text"
      name="foodName"
      placeholder="Food Name"
      value={menuItem.foodName}
      onChange={handleMenuChange}
      required
    />

    {/* Category ko select se input text me badal diya /}
    <input
      type="text"
      name="category"
      placeholder="Category (Veg, Non-Veg, Chinese...)"
      value={menuItem.category}
      onChange={handleMenuChange}
      required
    />

    <input
      type="number"
      name="price"
      placeholder="Price ₹"
      value={menuItem.price}
      onChange={handleMenuChange}
      required
    />

    <button type="submit">Add Menu</button>
  </form>
</div>
    </div>
  );
}

export default AdminPanel;*/





























