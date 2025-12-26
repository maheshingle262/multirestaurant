// src/context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

// ---------------- JWT Decode -------------------
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function getUserKeyFromToken(token) {
  const payload = decodeJwtPayload(token);
  const email =
    payload?.email ||
    payload?.username ||
    payload?.sub ||
    payload?.name;

  return email ? email.toLowerCase() : "guest";
}

// -------------- Provider ------------------
export const CartProvider = ({ children }) => {
  const [userKey, setUserKey] = useState("guest");

  const [cart, setCart] = useState(() => {
    const raw = localStorage.getItem(`sneha_cart_guest`);
    return raw ? JSON.parse(raw) : [];
  });

  // Detect login/logout
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      const newKey = getUserKeyFromToken(token);
      setUserKey(newKey);

      const raw = localStorage.getItem(`sneha_cart_${newKey}`);
      setCart(raw ? JSON.parse(raw) : []);
    };

    checkUser();

    const interval = setInterval(checkUser, 600);
    return () => clearInterval(interval);
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem(`sneha_cart_${userKey}`, JSON.stringify(cart));
  }, [cart, userKey]);

  // ---------- Cart Actions ----------
  const addToCart = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart.");
      return;
    }

    setCart((prev) => {
      const found = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.hotelId === item.hotelId
      );

      if (found) {
        return prev.map((i) =>
          i.productId === item.productId && i.hotelId === item.hotelId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          uid: Date.now(),
          productId: item.productId,
          foodName: item.foodName,
          hotelId: item.hotelId,
          hotelName: item.hotelName || "Unknown Hotel",
          price: item.price,
          qty: 1,
        },
      ];
    });
  };

  const updateQuantity = (uid, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((i) => i.uid !== uid));
    } else {
      setCart(cart.map((i) => (i.uid === uid ? { ...i, qty } : i)));
    }
  };

  const removeFromCart = (uid) => {
    setCart(cart.filter((i) => i.uid !== uid));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

/*// src/context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Global CartContext
 * - persist to localStorage (so cart survives reload)
  - item shape: { uid, hotelId, productId, foodName, price, qty }
 /

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("sneha_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("sneha_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist cart", e);
    }
  }, [cart]);

  // add item (merge if same productId+hotelId)
  const addToCart = (item) => {
    setCart((prev) => {
      // try merge by productId + hotelId
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.hotelId === item.hotelId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + (item.qty || 1) };
        return copy;
      }
      return [...prev, { ...item, uid: item.uid || `${item.hotelId}_${item.productId}_${Date.now()}`, qty: item.qty || 1 }];
    });
  };

  const updateQuantity = (uid, newQty) => {
    setCart((prev) => {
      if (newQty <= 0) return prev.filter((i) => i.uid !== uid);
      return prev.map((i) => (i.uid === uid ? { ...i, qty: newQty } : i));
    });
  };

  const removeFromCart = (uid) => {
    setCart((prev) => prev.filter((i) => i.uid !== uid));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + (i.qty || 0), 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};*/












/*// src/context/CartContext.js
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // global cart array of items
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    // if you want to merge same product (increase qty) implement logic here.
    // currently we add item objects with qty property; merging is optional.
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (uid) => {
    setCart((prev) => prev.filter((i) => i.uid !== uid));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};*/
