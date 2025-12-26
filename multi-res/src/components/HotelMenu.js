// src/components/HotelMenu.js
import { useEffect, useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import AddMenuForm from "./AddMenuForm";
import "./HotelMenu.css";
import HotelOrderList from "./HotelOrderList";

function HotelMenu({ hotelId, onBack }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrdersError, setMyOrdersError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN" || role === "SHOPKEEPER";

  const { addToCart } = useCart();

  useEffect(() => {
    if (hotelId) fetchHotelData(hotelId);
  }, [hotelId]);

  const fetchHotelData = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/hotels/${id}`);
      const data = res.data || {};
      data.menu = Array.isArray(data.menu) ? data.menu : [];
      setHotel(data);
    } catch (err) {
      console.error("Error fetching hotel data:", err);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  const findSelectedItem = (foodName) =>
    selectedItems.find((p) => p.item.foodName === foodName);


  // ✅ UPDATED CART ITEM (hotelName added)
  const handleAddToOrder = (item) => {
    setSelectedItems((prev) => {
      const found = prev.find(
        (p) =>
          p.item.foodName === item.foodName && p.item.price === item.price
      );
      if (found) {
        return prev.map((p) =>
          p === found ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { item, qty: 1 }];
    });

    const cartItem = {
      uid: `${hotelId}_${item.foodName}_${Date.now()}`,
      hotelId,
      hotelName: hotel?.hotelName || "",
      productId: item._id || item.id || item.foodName,
      foodName: item.foodName,
      price: item.price,
      qty: 1,
    };

    addToCart(cartItem);
  };

  const handleQtyChange = (foodName, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((p) =>
          p.item.foodName === foodName
            ? { ...p, qty: Math.max(0, p.qty + delta) }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const handleRemoveItem = (foodName) => {
    setSelectedItems((prev) =>
      prev.filter((p) => p.item.foodName !== foodName)
    );
  };

  // ✅ UPDATED single item order (hotelId + hotelName added)
  const handlePlaceSingleItemOrder = async (item, qtyFromCard = 1) => {
    if (!token) return alert("Please login to place an order.");

    const qty = Math.max(1, qtyFromCard);
    const total = item.price * qty;

    const orderData = {
      hotelId,
      hotelName: hotel.hotelName || "",
      foodName: `${qty}× ${item.foodName}`,
      quantity: qty,
      price: total,
      status: "Pending",
      orderDateTime: new Date().toISOString(),
    };

    try {
      await API.post(
        "/orders/save",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order placed for ${qty}× ${item.foodName}`);

      setSelectedItems((prev) => {
        const found = prev.find(
          (p) =>
            p.item.foodName === item.foodName &&
            p.item.price === item.price
        );
        if (!found) return prev;

        const remainingQty = found.qty - qty;
        if (remainingQty > 0) {
          return prev.map((p) =>
            p === found ? { ...p, qty: remainingQty } : p
          );
        }
        return prev.filter((p) => p !== found);
      });
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order.");
    }
  };

  // ✅ UPDATED All orders (hotelId + hotelName added)
  const handlePlaceAllOrders = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0)
      return alert("Select at least one item.");
    if (!token) return alert("Please login to place an order.");

    const totalPrice = selectedItems.reduce(
      (s, p) => s + p.item.price * p.qty,
      0
    );
    const totalQty = selectedItems.reduce((s, p) => s + p.qty, 0);
    const foodNames = selectedItems
      .map((p) => `${p.qty}× ${p.item.foodName}`)
      .join(", ");

    const orderData = {
      hotelId,
      hotelName: hotel.hotelName || "",
      foodName: foodNames,
      quantity: totalQty,
      price: totalPrice,
      status: "Pending",
      orderDateTime: new Date().toISOString(),
    };

    try {
      await API.post(
        "/orders/save",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setSelectedItems([]);
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order.");
    }
  };

  // ✅ FIXED hotelName filter
  const fetchMyOrders = async () => {
    if (!token) return alert("Please login to view orders.");
    if (!hotel) return alert("Hotel data not loaded yet.");

    setMyOrdersLoading(true);
    setMyOrdersError("");

    try {
      const res = await API.get(
        "/user/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const arr = Array.isArray(res.data) ? res.data : [];

      const filtered = arr.filter((o) => {
        const h =
          o.hotelName ||
          o.hotel ||
          (o.raw && o.raw.hotelName) ||
          "";

        return (
          h &&
          hotel?.hotelName &&
          String(h)
            .toLowerCase()
            .includes(String(hotel.hotelName).toLowerCase())
        );
      });

      const normalized = filtered.map((o) => ({
        id: o.id || o._id || o.orderId || "",
        foodName:
          o.foodName || (o.items ? o.items.join(", ") : ""),
        price: o.price ?? o.totalPrice ?? 0,
        status: o.status || "Pending",
        orderDateTime:
          o.orderDateTime || o.orderDate || o.date || "",
      }));

      setMyOrders(normalized);
      setShowMyOrders(true);
    } catch (err) {
      console.error("Error loading my orders:", err);
      setMyOrdersError(err?.message || "Failed to fetch orders");
      setShowMyOrders(true);
    } finally {
      setMyOrdersLoading(false);
    }
  };

  const fmt = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  if (loading)
    return (
      <div className="hotelmenu-loading large">
        ⏳ Loading menu...
      </div>
    );
  if (!hotel)
    return <div className="hotelmenu-error">❌ No hotel data found</div>;

  if (activeTab === "addmenu") {
    return (
      <div className="hotelmenu-wrapper">
        <div className="hotelmenu-topbar">
          <button
            className="hotelmenu-back-btn"
            onClick={() => setActiveTab("menu")}
          >
            ⬅ Back to Menu
          </button>
        </div>
        <div className="hotelmenu-container">
          <h2 className="hotelmenu-name">
            {hotel.hotelName} — Add Item
          </h2>
          <AddMenuForm
            hotelId={hotelId}
            onMenuAdded={() => fetchHotelData(hotelId)}
          />
        </div>
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="hotelmenu-wrapper">
        <div className="hotelmenu-topbar">
          <button
            className="hotelmenu-back-btn"
            onClick={() => setActiveTab("menu")}
          >
            ⬅ Back to Menu
          </button>
        </div>
        <div className="hotelmenu-container">
          <h2 className="hotelmenu-name">
            Orders — {hotel.hotelName}
          </h2>
          <HotelOrderList hotelName={hotel.hotelName} />
        </div>
      </div>
    );
  }

  return (
    <div className="hotelmenu-wrapper">
      <div className="hotelmenu-topbar">
        <div
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <button
            className="hotelmenu-back-btn"
            onClick={onBack}
          >
            ⬅ Back to Hotels
          </button>
          <div className="hotelmenu-brand">
            <div className="brand-dot">🍽️</div>
            <div>
              <div className="hotelmenu-name-sm">
                {hotel.hotelName}
              </div>
              <div className="hotelmenu-sub">
                📍 {hotel.location} • {hotel.specialization}
              </div>
            </div>
          </div>
        </div>

        <div className="hotelmenu-tabs">
          {isAdmin && (
            <>
              <button
                className="tab-btn"
                onClick={() => setActiveTab("addmenu")}
              >
                ➕ Add Menu
              </button>
              <button
                className="tab-btn"
                onClick={() => setActiveTab("orders")}
              >
                🧾 Orders
              </button>
            </>
          )}
          <button className="tab-btn ghost" onClick={fetchMyOrders}>
            📄 Your Orders
          </button>
        </div>
      </div>

      <div className="hotelmenu-container">
        <h2 className="hotelmenu-heading">📖 Menu</h2>

        <div className="hotelmenu-menu-container">
          {hotel.menu.length > 0 ? (
            hotel.menu.map((item, index) => {
              const sel = findSelectedItem(item.foodName);
              const qtyInCard = sel ? sel.qty : 0;

              return (
                <div
                  key={index}
                  className="hotelmenu-card"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="menu-row">
                    <div>
                      <div className="hotelmenu-title">
                        {item.foodName}
                      </div>
                      <div className="hotelmenu-category">
                        {item.category ||
                          item.specialization ||
                          "Item"}
                      </div>
                    </div>
                    <div className="hotelmenu-price">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="menu-actions">
                    <div className="qty-controls">
                      <button
                        aria-label={`decrease ${item.foodName}`}
                        onClick={() =>
                          handleQtyChange(item.foodName, -1)
                        }
                      >
                        -
                      </button>
                      <span>{qtyInCard}</span>
                      <button
                        aria-label={`increase ${item.foodName}`}
                        onClick={() =>
                          handleQtyChange(item.foodName, +1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="card-actions-right">
                      <button
                        className="hotelmenu-add-btn"
                        onClick={() => handleAddToOrder(item)}
                      >
                        ➕ Add to Cart
                      </button>

                      <button
                        className="hotelmenu-place-btn"
                        onClick={() =>
                          handlePlaceSingleItemOrder(
                            item,
                            Math.max(1, qtyInCard || 1)
                          )
                        }
                      >
                        ✅ Place Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="hotelmenu-empty">No items available</div>
          )}
        </div>

        <aside
          className={`order-drawer ${
            selectedItems.length ? "open" : ""
          }`}
          aria-hidden={selectedItems.length === 0}
        >
          <div className="drawer-header">
            <h4>Your Order</h4>
            <button
              className="close-drawer"
              onClick={() => setSelectedItems([])}
            >
              ✕
            </button>
          </div>

          <div className="order-list">
            {selectedItems.length === 0 && (
              <div className="empty-note">
                No items yet — add from menu
              </div>
            )}

            {selectedItems.map((p, i) => (
              <div key={i} className="order-item">
                <div className="order-item-left">
                  <div className="order-name">
                    {p.item.foodName}
                  </div>
                  <div className="order-meta">
                    ₹{p.item.price} × {p.qty} = ₹
                    {p.item.price * p.qty}
                  </div>
                </div>

                <div className="order-item-actions">
                  <button
                    onClick={() =>
                      handleQtyChange(p.item.foodName, -1)
                    }
                  >
                    -
                  </button>
                  <span>{p.qty}</span>
                  <button
                    onClick={() =>
                      handleQtyChange(p.item.foodName, +1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="remove"
                    onClick={() =>
                      handleRemoveItem(p.item.foodName)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="drawer-footer">
            <div className="total">
              Total: ₹
              {selectedItems.reduce(
                (s, p) => s + p.item.price * p.qty,
                0
              )}
            </div>

            <form
              onSubmit={handlePlaceAllOrders}
              className="drawer-form"
            >
              <button
                type="submit"
                className="hotelmenu-submit-btn"
                disabled={selectedItems.length === 0}
              >
                ✅ Place All Orders
              </button>
            </form>
          </div>
        </aside>
      </div>

      {showMyOrders && (
        <div
          className="modal-overlay"
          onClick={() => setShowMyOrders(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h3>📄 Your Orders — {hotel.hotelName}</h3>
              <button onClick={() => setShowMyOrders(false)}>
                ✕
              </button>
            </div>

            {myOrdersLoading && <p>Loading...</p>}
            {myOrdersError && (
              <p className="error">{myOrdersError}</p>
            )}

            {!myOrdersLoading &&
              myOrders.length === 0 &&
              !myOrdersError && <p>No orders found.</p>}

            {!myOrdersLoading && myOrders.length > 0 && (
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((o, i) => (
                      <tr key={o.id || i}>
                        <td>{i + 1}</td>
                        <td>{o.foodName}</td>
                        <td>₹{o.price}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              o.status === "Completed"
                                ? "done"
                                : "pending"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td>{fmt(o.orderDateTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ textAlign: "right", marginTop: 12 }}>
              <button
                className="tab-btn"
                onClick={() => setShowMyOrders(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelMenu;










/*// src/components/HotelMenu.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import AddMenuForm from "./AddMenuForm";
import "./HotelMenu.css";
import HotelOrderList from "./HotelOrderList";

function HotelMenu({ hotelId, onBack }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "addmenu" | "orders"
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrdersError, setMyOrdersError] = useState("");

  // 🔥 ROLE-BASED ACCESS CONTROL
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN" || role === "SHOPKEEPER";

  useEffect(() => {
    if (hotelId) fetchHotelData(hotelId);
  }, [hotelId]);

  const fetchHotelData = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/hotels/${id}`);
      setHotel(res.data);
    } catch (err) {
      console.error("❌ Error fetching hotel menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert("⚠️ Select at least one item!");
    if (!token) return alert("⚠️ You must login first to place an order.");

    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
      hotelName: hotel.hotelName,
      foodName: selectedItems.map((i) => i.foodName).join(", "),
      quantity: selectedItems.length,
      price: total,
      status: "Pending",
      orderDateTime: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/api/orders/save", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Order placed successfully!");
      setSelectedItems([]);
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      alert("❌ Failed to place order");
    }
  };

  const fetchMyOrders = async () => {
    if (!token) {
      alert("⚠️ Please login to view your orders.");
      return;
    }
    if (!hotel) {
      alert("Hotel data not loaded yet.");
      return;
    }

    setMyOrdersLoading(true);
    setMyOrdersError("");

    try {
      const res = await axios.get("http://localhost:8080/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = Array.isArray(res.data) ? res.data : [];

      const filtered = arr.filter((o) => {
        const h = o.hotelName || o.hotel || (o.raw && o.raw.hotelName) || "";
        return String(h).toLowerCase() === String(hotel.hotelName).toLowerCase();
      });

      const normalized = filtered.map((o) => ({
        id: o.id || o._id || o.orderId || "",
        customerName: o.customerName || o.username || "",
        customerEmail: o.customerEmail || o.email || "",
        address: o.address || o.deliveryAddress || o.customerAddress || "",
        contact: o.contact || o.phone || o.customerPhone || "",
        foodName: o.foodName || (o.items ? o.items.join(", ") : ""),
        quantity: o.quantity || (o.items ? o.items.length : 1),
        price: o.price ?? o.totalPrice ?? 0,
        status: o.status || "Pending",
        orderDateTime: o.orderDateTime || o.orderDate || o.date || null,
        hotelName: o.hotelName || hotel.hotelName || "",
      }));

      setMyOrders(normalized);
      setShowMyOrders(true);
    } catch (err) {
      console.error("❌ Error loading my orders:", err);
      setMyOrdersError(
        err?.response?.data || err?.message || "Failed to fetch your orders"
      );
      setShowMyOrders(true);
    } finally {
      setMyOrdersLoading(false);
    }
  };

  const fmt = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  if (loading) return <p className="hotelmenu-loading">⏳ Loading menu...</p>;
  if (!hotel) return <p className="hotelmenu-error">❌ No hotel data found</p>;

  // ========= TABS SWITCHING =============
  if (activeTab === "addmenu") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>➕ Add Menu Item</h2>
        <AddMenuForm hotelId={hotelId} onMenuAdded={() => fetchHotelData(hotelId)} />
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>📦 Orders List</h2>
        <HotelOrderList hotelName={hotel?.hotelName} />
      </div>
    );
  }

  // ========= MAIN MENU =============
  return (
    <div className="hotelmenu-main">
      <div className="hotelmenu-topbar">
        <button className="hotelmenu-back-btn" onClick={onBack}>⬅ Back to Hotels</button>

        <div className="hotelmenu-tabs">

          {/* 🔥 Only Admin / Shopkeeper can see these /}
          {isAdmin && (
            <>
              <button onClick={() => setActiveTab("addmenu")}>➕ Add Menu</button>
              <button onClick={() => setActiveTab("orders")}>🧾 Orders</button>
            </>
          )}

          {/* Always visible /}
          <button onClick={fetchMyOrders}>📄 Your Orders</button>
        </div>
      </div>

      <div className="hotelmenu-container">
        <h2 className="hotelmenu-name">{hotel.hotelName}</h2>
        <p className="hotelmenu-location">📍 {hotel.location}</p>
        <p className="hotelmenu-specialization">🍽 {hotel.specialization}</p>

        <h3 className="hotelmenu-heading">📖 Menu</h3>

        <div className="hotelmenu-menu-container">
          {hotel.menu.length > 0 ? (
            hotel.menu.map((item, index) => (
              <div className="hotelmenu-card" key={index}>
                <div className="hotelmenu-title">
                  {item.foodName} - <span className="hotelmenu-category">{item.category}</span>
                </div>
                <div className="hotelmenu-price">₹{item.price}</div>

                <button className="hotelmenu-add-btn" onClick={() => handleAddToOrder(item)}>
                  ➕ Add to Order
                </button>
              </div>
            ))
          ) : (
            <p className="hotelmenu-empty">❌ No items available</p>
          )}
        </div>

        {selectedItems.length > 0 && (
          <form className="hotelmenu-order-form" onSubmit={handlePlaceOrder}>
            <h3>🧾 Confirm Your Order</h3>

            <div className="hotelmenu-summary">
              <p><b>Items:</b> {selectedItems.length}</p>
              <p><b>Total:</b> ₹{selectedItems.reduce((sum, i) => sum + i.price, 0)}</p>
            </div>

            <button type="submit" className="hotelmenu-submit-btn">✅ Place Order</button>
          </form>
        )}
      </div>

      {/* ======== MY ORDERS POPUP ======== /}
      {showMyOrders && (
        <div
          className="modal-overlay"
          onClick={() => setShowMyOrders(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "92%",
              maxWidth: 800,
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>📄 Your Orders — {hotel.hotelName}</h3>
              <button onClick={() => setShowMyOrders(false)} style={{ background: "transparent", border: 0, fontSize: 20 }}>
                ✕
              </button>
            </div>

            {myOrdersLoading && <p>⏳ Loading your orders...</p>}
            {myOrdersError && <p style={{ color: "red" }}>{myOrdersError}</p>}

            {!myOrdersLoading && myOrders.length === 0 && !myOrdersError && (
              <p>No orders found for you at this hotel.</p>
            )}

            {!myOrdersLoading && myOrders.length > 0 && (
              <div style={{ maxHeight: "60vh", overflow: "auto", marginTop: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                      <th>#</th>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myOrders.map((o, i) => (
                      <tr key={o.id || i} style={{ borderBottom: "1px solid #f1f1f1" }}>
                        <td style={{ padding: "8px" }}>{i + 1}</td>
                        <td style={{ padding: "8px" }}>{o.id}</td>
                        <td style={{ padding: "8px" }}>{o.foodName}</td>
                        <td style={{ padding: "8px" }}>₹{o.price}</td>
                        <td style={{ padding: "8px" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: 8,
                              background: o.status === "Completed" ? "#d4f5dd" : "#fff3cd",
                              color: "#333",
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: "8px" }}>{fmt(o.orderDateTime)}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                onClick={() => setShowMyOrders(false)}
                style={{ padding: "8px 14px", borderRadius: 8 }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default HotelMenu;*/















/*/ src/components/HotelMenu.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import AddMenuForm from "./AddMenuForm";
import "./HotelMenu.css";
import HotelOrderList from "./HotelOrderList";

function HotelMenu({ hotelId, onBack }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "addmenu" | "orders"

  const token = localStorage.getItem("token"); // ✅ logged-in user token

  useEffect(() => {
    if (hotelId) fetchHotelData(hotelId);
  }, [hotelId]);

  const fetchHotelData = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/hotels/${id}`);
      setHotel(res.data);
    } catch (err) {
      console.error("❌ Error fetching hotel menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert("⚠️ Select at least one item!");
    if (!token) return alert("⚠️ You must login first to place an order.");

    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
      hotelName: hotel.hotelName,
      foodName: selectedItems.map((i) => i.foodName).join(", "),
      quantity: selectedItems.length,
      price: total,
      status: "Pending",
      orderDateTime: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/api/orders/save", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Order placed successfully!");
      setSelectedItems([]);
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      alert("❌ Failed to place order");
    }
  };

  if (loading) return <p className="hotelmenu-loading">⏳ Loading menu...</p>;
  if (!hotel) return <p className="hotelmenu-error">❌ No hotel data found</p>;

  // ✅ Different tabs
  if (activeTab === "addmenu") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>➕ Add Menu Item</h2>
        <AddMenuForm hotelId={hotelId} onMenuAdded={() => fetchHotelData(hotelId)} />
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>📦 Orders List</h2>
        <HotelOrderList hotelName={hotel.hotelName} />
      </div>
    );
  }

  return (
    <div className="hotelmenu-main">
      {/* Top Bar /}
      <div className="hotelmenu-topbar">
        <button className="hotelmenu-back-btn" onClick={onBack}>⬅ Back to Hotels</button>
        <div className="hotelmenu-tabs">
          <button onClick={() => setActiveTab("addmenu")}>➕ Add Menu</button>
          <button onClick={() => setActiveTab("orders")}>🧾 Orders</button>
        </div>
      </div>

      {/* Hotel Info /}
      <div className="hotelmenu-container">
        <h2 className="hotelmenu-name">{hotel.hotelName}</h2>
        <p className="hotelmenu-location">📍 {hotel.location}</p>
        <p className="hotelmenu-specialization">🍽 {hotel.specialization}</p>

        {/* Menu Items /}
        <h3 className="hotelmenu-heading">📖 Menu</h3>
        <div className="hotelmenu-menu-container">
          {hotel.menu.length > 0 ? (
            hotel.menu.map((item, index) => (
              <div className="hotelmenu-card" key={index}>
                <div className="hotelmenu-title">
                  {item.foodName} - <span className="hotelmenu-category">{item.category}</span>
                </div>
                <div className="hotelmenu-price">₹{item.price}</div>
                <button className="hotelmenu-add-btn" onClick={() => handleAddToOrder(item)}>
                  ➕ Add to Order
                </button>
              </div>
            ))
          ) : (
            <p className="hotelmenu-empty">❌ No items available</p>
          )}
        </div>

        {/* Order Form /}
        {selectedItems.length > 0 && (
          <form className="hotelmenu-order-form" onSubmit={handlePlaceOrder}>
            <h3>🧾 Confirm Your Order</h3>
            <div className="hotelmenu-summary">
              <p><b>Items:</b> {selectedItems.length}</p>
              <p><b>Total:</b> ₹{selectedItems.reduce((sum, i) => sum + i.price, 0)}</p>
            </div>
            <button type="submit" className="hotelmenu-submit-btn">✅ Place Order</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default HotelMenu;







/*import axios from "axios";   ye wala code withaout delete option ka hai or this code is withaout Add to cart system means users can see not see past orders and adit profile fun or not reqqiuer to place order fil form 
import { useEffect, useState } from "react";
import AddMenuForm from "./AddMenuForm";
import "./HotelMenu.css";
import HotelOrderList from "./HotelOrderList";

function HotelMenu({ hotelId, onBack }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "addmenu" | "orders"

  useEffect(() => {
    if (hotelId) fetchHotelData(hotelId);
  }, [hotelId]);

  const fetchHotelData = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/hotels/${id}`);
      setHotel(res.data);
    } catch (err) {
      console.error("❌ Error fetching hotel menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert("⚠️ Select at least one item!");
    if (!/^\d{10}$/.test(contact)) return alert("⚠️ Enter a valid 10-digit contact number!");

    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
      customerName,
      hotelName: hotel.hotelName,
      foodName: selectedItems.map((i) => i.foodName).join(", "),
      quantity: selectedItems.length,
      price: total,
      status: "Pending",
      orderDateTime: new Date().toISOString(),
      address,
      contact,
    };

    try {
      await axios.post("http://localhost:8080/api/orders/save", orderData);
      alert("✅ Order placed successfully!");
      setSelectedItems([]);
      setCustomerName("");
      setAddress("");
      setContact("");
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      alert("❌ Failed to place order");
    }
  };

  if (loading) return <p className="hotelmenu-loading">⏳ Loading menu...</p>;
  if (!hotel) return <p className="hotelmenu-error">❌ No hotel data found</p>;

  // ✅ Render different screens based on activeTab
  if (activeTab === "addmenu") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>➕ Add Menu Item</h2>
        <AddMenuForm hotelId={hotelId} onMenuAdded={() => fetchHotelData(hotelId)} />
      </div>
    );
  }

  if (activeTab === "orders") {
    return (
      <div className="hotelmenu-fullpage">
        <button className="hotelmenu-back-btn" onClick={() => setActiveTab("menu")}>
          ⬅ Back to Menu
        </button>
        <h2>📦 Orders List</h2>
        <HotelOrderList hotelName={hotel.hotelName} />
      </div>
    );
  }

  // ✅ Default "Menu" Page
  return (
    <div className="hotelmenu-main">
      {/* Top Bar /}
      <div className="hotelmenu-topbar">
        <button className="hotelmenu-back-btn" onClick={onBack}>⬅ Back to Hotels</button>
        <div className="hotelmenu-tabs">
          <button onClick={() => setActiveTab("addmenu")}>➕ Add Menu</button>
          <button onClick={() => setActiveTab("orders")}>🧾 Orders</button>
        </div>
      </div>

      {/* Hotel Info /}
      <div className="hotelmenu-container">
        <h2 className="hotelmenu-name">{hotel.hotelName}</h2>
        <p className="hotelmenu-location">📍 {hotel.location}</p>
        <p className="hotelmenu-specialization">🍽 {hotel.specialization}</p>

        {/* Menu Items /}
        <h3 className="hotelmenu-heading">📖 Menu</h3>
        <div className="hotelmenu-menu-container">
          {hotel.menu.length > 0 ? (
            hotel.menu.map((item, index) => (
              <div className="hotelmenu-card" key={index}>
                <div className="hotelmenu-title">
                  {item.foodName} - <span className="hotelmenu-category">{item.category}</span>
                </div>
                <div className="hotelmenu-price">₹{item.price}</div>
                <button className="hotelmenu-add-btn" onClick={() => handleAddToOrder(item)}>
                  ➕ Add to Order
                </button>
              </div>
            ))
          ) : (
            <p className="hotelmenu-empty">❌ No items available</p>
          )}
        </div>

        {/* Order Form /}
        {selectedItems.length > 0 && (
          <form className="hotelmenu-order-form" onSubmit={handlePlaceOrder}>
            <h3>🧾 Place Your Order</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />

            <div className="hotelmenu-summary">
              <p><b>Items:</b> {selectedItems.length}</p>
              <p><b>Total:</b> ₹{selectedItems.reduce((sum, i) => sum + i.price, 0)}</p>
            </div>

            <button type="submit" className="hotelmenu-submit-btn">✅ Confirm Order</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default HotelMenu;*/

















































