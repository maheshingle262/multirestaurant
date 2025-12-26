import API from "../../api";

import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import "./CartPage.css"; // Import the new CSS file

const fmt = (num) => Number(num).toLocaleString("en-IN");

export default function CartPage({ setActivePanel }) {
  const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  const items = Array.isArray(cart) ? cart : [];

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [items]
  );

  const grouped = useMemo(() => {
    const g = {};
    items.forEach((it) => {
      const key = it.hotelName || "Unknown Hotel";
      if (!g[key]) g[key] = [];
      g[key].push(it);
    });
    return g;
  }, [items]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place your order.");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      for (const hotelName of Object.keys(grouped)) {
        const group = grouped[hotelName];

        const payload = {
          hotelName,
          foodName: group.map((x) => `${x.qty}× ${x.foodName}`).join(", "),
          quantity: group.reduce((s, x) => s + x.qty, 0),
          price: group.reduce((s, x) => s + x.qty * x.price, 0),
          status: "Pending",
          orderDateTime: new Date().toISOString(),
        };

        await API.post("/orders/save", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Order placed successfully!");
      clearCart();
      setActivePanel("welcome");
    } catch (err) {
      console.error(err);
      alert("Order failed!");
    }

    setPlacing(false);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart</h2>

        <button 
          className="clear-btn" 
          onClick={() => window.confirm("Clear cart?") && clearCart()}
        >
          Clear
        </button>
      </div>

      {items.length === 0 ? (
        <p className="empty-cart">No items in cart.</p>
      ) : (
        <>
          {items.map((it) => (
            <div key={it.uid} className="cart-card">
              <div>
                <div className="food-name">{it.foodName}</div>
                <div className="hotel-name">Hotel: {it.hotelName}</div>
                <div className="price-line">
                  ₹{it.price} × {it.qty} = <strong>₹{(it.price * it.qty).toFixed(2)}</strong>
                </div>
              </div>

              <div className="qty-section">
                <button className="qty-btn" onClick={() => updateQuantity(it.uid, it.qty - 1)}>-</button>
                <span className="qty-number">{it.qty}</span>
                <button className="qty-btn" onClick={() => updateQuantity(it.uid, it.qty + 1)}>+</button>
                <button className="remove-btn" onClick={() => removeFromCart(it.uid)}>Remove</button>
              </div>
            </div>
          ))}

          {/* FOOTER */}
          <div className="cart-footer">
            <div className="total-info">
              <strong>Total Items:</strong> {cartCount} <br />
              <strong>Total Price:</strong> ₹{fmt(total)}
            </div>

            <div className="footer-buttons">
              <button
                className="continue-btn"
                onClick={() => setActivePanel("hotels")}
              >
                Continue Shopping
              </button>

              <button
                className="checkout-btn"
                disabled={placing}
                onClick={handleCheckout}
              >
                {placing ? "Placing..." : "Checkout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}










/*// src/components/cart/CartPage.js
import axios from "axios";
import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";

// FIXED: fmt defined at top
const fmt = (num) => Number(num).toLocaleString("en-IN");

export default function CartPage({ setActivePanel }) {
  const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  const items = Array.isArray(cart) ? cart : [];

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [items]
  );

  // Group by hotel
  const grouped = useMemo(() => {
    const g = {};
    items.forEach((it) => {
      const key = it.hotelName || "Unknown Hotel";
      if (!g[key]) g[key] = [];
      g[key].push(it);
    });
    return g;
  }, [items]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place your order.");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      for (const hotelName of Object.keys(grouped)) {
        const group = grouped[hotelName];

        const payload = {
          hotelName,
          foodName: group.map((x) => `${x.qty}× ${x.foodName}`).join(", "),
          quantity: group.reduce((s, x) => s + x.qty, 0),
          price: group.reduce((s, x) => s + x.qty * x.price, 0),
          status: "Pending",
          orderDateTime: new Date().toISOString(),
        };

        await axios.post("http://localhost:8080/api/orders/save", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Order placed successfully!");
      clearCart();
      setActivePanel("welcome");
    } catch (err) {
      console.error(err);
      alert("Order failed!");
    }

    setPlacing(false);
  };

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Your Cart</h2>

        <div>
          <button onClick={() => setActivePanel("menu")} style={{ marginRight: 8 }}>
            ← Back
          </button>

          <button onClick={() => window.confirm("Clear cart?") && clearCart()}>
            Clear
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {items.map((it) => (
            <div
              key={it.uid}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 6,
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{it.foodName}</div>
                <div style={{ fontSize: 13 }}>Hotel: {it.hotelName}</div>
                <div>
                  ₹{it.price} × {it.qty} = ₹{(it.price * it.qty).toFixed(2)}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => updateQuantity(it.uid, it.qty - 1)}>-</button>
                <span>{it.qty}</span>
                <button onClick={() => updateQuantity(it.uid, it.qty + 1)}>+</button>
                <button onClick={() => removeFromCart(it.uid)}>Remove</button>
              </div>
            </div>
          ))}

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <strong>Total Items:</strong> {cartCount} <br />
              <strong>Total Price:</strong> ₹{fmt(total)}
            </div>

            <button
              disabled={placing}
              onClick={handleCheckout}
              style={{ padding: "8px 14px", fontWeight: 600 }}
            >
              {placing ? "Placing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}*/




