	  
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './OrderList.css';

function OrderList({ setActivePanel }) {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = () => {
    axios.get("http://localhost:8080/api/order")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const fetchOrdersByDate = (date) => {
    axios.get(`http://localhost:8080/api/order/byDate`, {
      params: { date }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    axios.put(`http://localhost:8080/api/order/${orderId}/status`, null, {
      params: { status: newStatus }
    })
      .then(() => {
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        alert(`Order marked as ${newStatus}`);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update status.");
      });
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    if (selected) {
      fetchOrdersByDate(selected);
    } else {
      fetchAllOrders();
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled');

  return (
    <div className="order-list-panel">
      <div className="order-list-header">
        <h2>Order List</h2>
      </div>

      <div className="calendar-filter">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="order-list-stats">
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat-card">
          <span>Active Orders</span>
          <strong>{activeOrders.length}</strong>
        </div>
        <div className="stat-card">
          <span>Revenue</span>
          <strong>₹{orders.reduce((sum, order) => sum + (order.total || 0), 0)}</strong>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No Orders Found</h3>
          <p>Orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="order-row">
                    <td className="order-id">#{order.id.slice(-6)}</td>
                    <td className="customer-info">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="customer-address">{order.address}</div>
                    </td>
                    <td>{order.contact}</td>
                    <td>{order.items?.length || 1} item(s)</td>
                    <td className="order-total">₹{order.total || order.price}</td>
                    <td>
                      <span className={`status-badge ${order.status?.toLowerCase()}`}>
                        {order.status || 'Preparing'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleOrderDetails(order.id)} className="details-btn">
                        {expandedOrder === order.id ? '▲' : '▼'} Details
                      </button>
                    </td>
                    {/* Display time directly from backend */}
                    <td>{order.time}</td>
                  </tr>

                  {expandedOrder === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="8">
                        <div className="details-container">
                          <h4>Order Details</h4>
                          <table className="items-table">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.foodName}</td>
                                  <td>{item.category}</td>
                                  <td>₹{item.price}</td>
                                  <td>{item.quantity || 1}</td>
                                  <td>₹{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="order-actions">
                            <button className="action-btn ready" onClick={() => updateOrderStatus(order.id, 'Ready')}>Ready</button>
                            <button className="action-btn complete" onClick={() => updateOrderStatus(order.id, 'Completed')}>Complete</button>
                            <button className="action-btn cancel" onClick={() => updateOrderStatus(order.id, 'Cancelled')}>Cancel</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;















