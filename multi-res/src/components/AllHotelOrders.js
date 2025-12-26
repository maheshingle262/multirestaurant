import { useEffect, useState } from "react";
import API from "../api";
import "./AllHotelOrders.css";

function AllHotelOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/all");
      let data = (res.data || []).sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(data);
      setFilteredOrders(data);

      const uniqueHotels = [...new Set(data.map((o) => o.hotelName))];
      setHotels(uniqueHotels);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleFilter = (hotel) => {
    setSelectedHotel(hotel);
    setFilteredOrders(
      hotel === "all" ? orders : orders.filter((o) => o.hotelName === hotel)
    );
  };

  const getStatusClass = (status) => {
    if (!status) return "status-badge status-pending";
    switch (status.toLowerCase()) {
      case "completed":
        return "status-badge status-completed";
      case "cancelled":
        return "status-badge status-cancelled";
      case "ready":
        return "status-badge status-ready";
      case "pending":
      default:
        return "status-badge status-pending";
    }
  };

  // ✅ Safe date formatting
  const formatDate = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d)) return "—";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="all-orders-container">
      <h2 className="all-orders-title">All Hotel Orders</h2>

      <div className="all-orders-filter-bar">
        <label>Filter by Hotel: </label>
        <select value={selectedHotel} onChange={(e) => handleFilter(e.target.value)}>
          <option value="all">All Hotels</option>
          {hotels.map((hotel, index) => (
            <option key={index} value={hotel}>
              {hotel}
            </option>
          ))}
        </select>
        <span className="all-orders-count">({filteredOrders.length} orders)</span>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="all-orders-empty">No orders found</p>
      ) : (
        <table className="all-orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Hotel</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.orderId || order._id || index}>
                <td>{index + 1}</td>
                <td>{order.orderId || order._id || "—"}</td>
                <td>{order.hotelName || "—"}</td>
                <td>{order.customerName || "—"}</td>
                <td>
                  {(order.items || []).map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </td>
                <td>₹{order.totalPrice || order.price || 0}</td>
                <td>
                  <span className={getStatusClass(order.status)}>
                    {order.status || "Pending"}
                  </span>
                </td>
                <td>{formatDate(order.orderDate || order.orderDateTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllHotelOrders;
















/*import axios from "axios";
import { useEffect, useState } from "react";
import "./AllHotelOrders.css";

function AllHotelOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/all");
      let data = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(data);
      setFilteredOrders(data);

      const uniqueHotels = [...new Set(data.map((o) => o.hotelName))];
      setHotels(uniqueHotels);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleFilter = (hotel) => {
    setSelectedHotel(hotel);
    setFilteredOrders(
      hotel === "all" ? orders : orders.filter((o) => o.hotelName === hotel)
    );
  };

  const getStatusClass = (status) => {
    if (!status) return "status-badge status-pending";
    switch (status.toLowerCase()) {
      case "completed":
        return "status-badge status-completed";
      case "cancelled":
        return "status-badge status-cancelled";
      case "ready":
        return "status-badge status-ready";
      case "pending":
      default:
        return "status-badge status-pending";
    }
  };

  return (
    <div className="all-orders-container">
      <h2 className="all-orders-title">All Hotel Orders</h2>

      <div className="all-orders-filter-bar">
        <label>Filter by Hotel: </label>
        <select value={selectedHotel} onChange={(e) => handleFilter(e.target.value)}>
          <option value="all">All Hotels</option>
          {hotels.map((hotel, index) => (
            <option key={index} value={hotel}>
              {hotel}
            </option>
          ))}
        </select>
        <span className="all-orders-count">({filteredOrders.length} orders)</span>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="all-orders-empty">No orders found</p>
      ) : (
        <table className="all-orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Hotel</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              {/* 🛑 Removed Action Column /}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.orderId}>
                <td>{index + 1}</td>
                <td>{order.orderId}</td>
                <td>{order.hotelName}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                {/* 🛑 Removed Action Dropdown /}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllHotelOrders;*/


