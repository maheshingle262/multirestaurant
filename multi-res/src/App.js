// src/App.js
import { useState } from "react";
import "./App.css";

import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import AllHotelOrders from "./components/AllHotelOrders";
import HotelList from "./components/HotelList";
import HotelMenu from "./components/HotelMenu";
import MenuPanel from "./components/MenuPanel";
import Navbar from "./components/Navbar";
import OrderList from "./components/OrderList";
import Profile from "./components/Profile";
import Welcome from "./components/Welcome";

import CartPage from "./components/cart/CartPage";
import { CartProvider } from "./context/CartContext";

function App() {
  const [activePanel, setActivePanel] = useState("welcome");
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  return (
    <CartProvider>
      <div className="App">
        <Navbar setActivePanel={setActivePanel} activePanel={activePanel} />

        {activePanel === "welcome" && <Welcome setActivePanel={setActivePanel} />}
        {activePanel === "menu" && <MenuPanel />}
        {activePanel === "about" && <About />}

        {activePanel === "order" && <OrderList />}
        {activePanel === "admin" && <AdminPanel />}
        {activePanel === "allOrders" && <AllHotelOrders />}

        {activePanel === "hotels" && (
          <HotelList
            onHotelSelect={(id) => {
              setSelectedHotelId(id);
              setActivePanel("hotelMenu");
            }}
          />
        )}

        {activePanel === "hotelMenu" && selectedHotelId && (
          <HotelMenu hotelId={selectedHotelId} onBack={() => setActivePanel("hotels")} />
        )}

        {activePanel === "profile" && <Profile />}

        {activePanel === "cart" && <CartPage setActivePanel={setActivePanel} />}
      </div>
    </CartProvider>
  );
}

export default App;









/*// src/App.js
import { useState } from "react";
import "./App.css";

import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import AllHotelOrders from "./components/AllHotelOrders";
import HotelList from "./components/HotelList";
import HotelMenu from "./components/HotelMenu";
import MenuPanel from "./components/MenuPanel";
import Navbar from "./components/Navbar";
import OrderList from "./components/OrderList";
import Profile from "./components/Profile";
import Welcome from "./components/Welcome";

function App() {
  const [activePanel, setActivePanel] = useState("welcome");
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  return (
    <div className="App">
      {/* Navbar controls panel switching /}
      <Navbar setActivePanel={setActivePanel} activePanel={activePanel} />

      {activePanel === "welcome" && <Welcome setActivePanel={setActivePanel} />}
      {activePanel === "menu" && <MenuPanel />}
      {activePanel === "about" && <About />}

      {/* These 3 are now protected by role check in Navbar:
          OrderList, AdminPanel, AllHotelOrders /}
      {activePanel === "order" && <OrderList />}
      {activePanel === "admin" && <AdminPanel />}
      {activePanel === "allOrders" && <AllHotelOrders />}

      {activePanel === "hotels" && (
        <HotelList
          onHotelSelect={(id) => {
            setSelectedHotelId(id);
            setActivePanel("hotelMenu");
          }}
        />
      )}

      {activePanel === "hotelMenu" && selectedHotelId && (
        <HotelMenu hotelId={selectedHotelId} />
      )}

      {activePanel === "profile" && <Profile />}
    </div>
  );
}

export default App;*/















































