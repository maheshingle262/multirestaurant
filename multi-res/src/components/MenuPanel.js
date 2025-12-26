import axios from 'axios';
import { useEffect, useState } from 'react';
import './MenuPanel.css';

function MenuPanel() {
  const [menuItems, setMenuItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('Main Course');
  const [selectedItems, setSelectedItems] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/order')
      .then((res) => {
        const categorized = {};
        res.data.forEach(order => {
          if (order.status === 'MenuItem') {
            order.items.forEach(item => {
              if (!categorized[item.category]) {
                categorized[item.category] = [];
              }
              categorized[item.category].push(item);
            });
          }
        });
        setMenuItems(categorized);
      })
      .catch((err) => console.error('Error fetching menu items:', err));
  }, []);

  const handleSelect = (item, qty = 1) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.foodName]: {
        ...item,
        quantity: parseInt(qty)
      }
    }));
  };

  const handleRemove = (name) => {
    const copy = { ...selectedItems };
    delete copy[name];
    setSelectedItems(copy);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const items = Object.values(selectedItems);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      customerName,
      address,
      contact,
      items,
      total,
    };

    try {
      await axios.post('http://localhost:8080/api/order', orderData);
      alert('✅ Order placed successfully!');
      setCustomerName('');
      setAddress('');
      setContact('');
      setSelectedItems({});
    } catch (err) {
      console.error(err);
      alert('❌ Failed to place order');
    }
  };

  const totalPrice = Object.values(selectedItems)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = Object.keys(menuItems);

  return (
    <div className="old-menu-container">
      <h2>🍽 Sneha Kitchen Menu</h2>

      <div className="old-category-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === activeCategory ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="old-menu-list">
        <h3>{activeCategory}</h3>
        {menuItems[activeCategory]?.map((item, index) => {
          const selected = selectedItems[item.foodName];
          return (
            <div
              key={index}
              className={`old-menu-card ${selected ? 'selected-card' : ''}`}
            >
              <strong>{item.foodName}</strong> - ₹{item.price}
              <input
                type="number"
                min="1"
                defaultValue={selected?.quantity || ''}
                placeholder="Qty"
                onChange={(e) => handleSelect(item, e.target.value)}
              />
              <button onClick={() => handleRemove(item.foodName)}>Remove</button>
            </div>
          );
        })}
      </div>

      {Object.keys(selectedItems).length > 0 && (
        <div className="old-selection-summary">
          <h3>🧾 Selected Items</h3>
          <ul>
            {Object.values(selectedItems).map((item, index) => (
              <li key={index}>
                {item.foodName} × {item.quantity} = ₹{item.quantity * item.price}
              </li>
            ))}
          </ul>
          <h3 className="old-total-amount">Total Price: ₹{totalPrice}</h3>

          <form className="old-order-form" onSubmit={handleOrderSubmit}>
            <h4>Customer Details</h4>
            <input
              type="text"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <button type="submit" className="old-submit-btn">✅ Place Order</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MenuPanel;















/*import axios from 'axios';
import { useEffect, useState } from 'react';
import './MenuPanel.css';

function MenuPanel() {
  const [menuItems, setMenuItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('Main Course');
  const [selectedItems, setSelectedItems] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/order')
      .then((res) => {
        const categorized = {};
        res.data.forEach(order => {
          if (order.status === 'MenuItem') {
            order.items.forEach(item => {
              if (!categorized[item.category]) {
                categorized[item.category] = [];
              }
              categorized[item.category].push(item);
            });
          }
        });
        setMenuItems(categorized);
      })
      .catch((err) => console.error('Error fetching menu items:', err));
  }, []);

  const handleSelect = (item, qty = 1) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.foodName]: {
        ...item,
        quantity: parseInt(qty)
      }
    }));
  };

  const handleRemove = (name) => {
    const copy = { ...selectedItems };
    delete copy[name];
    setSelectedItems(copy);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const items = Object.values(selectedItems);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      customerName,
      address,
      contact,
      items,
      total,
    };

    try {
      await axios.post('http://localhost:8080/api/order', orderData);
      alert('✅ Order placed successfully!');
      setCustomerName('');
      setAddress('');
      setContact('');
      setSelectedItems({});
    } catch (err) {
      console.error(err);
      alert('❌ Failed to place order');
    }
  };

  const totalPrice = Object.values(selectedItems)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = Object.keys(menuItems);

  return (
    <div className="menu-container">
      <h2>🍽 Sneha Kitchen Menu</h2>

      <div className="category-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === activeCategory ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-list">
        <h3>{activeCategory}</h3>
        {menuItems[activeCategory]?.map((item, index) => {
          const selected = selectedItems[item.foodName];
          return (
            <div
              key={index}
              className={`menu-card ${selected ? 'selected-card' : ''}`}
            >
              <strong>{item.foodName}</strong> - ₹{item.price}
              <input
                type="number"
                min="1"
                defaultValue={selected?.quantity || ''}
                placeholder="Qty"
                onChange={(e) => handleSelect(item, e.target.value)}
              />
              <button onClick={() => handleRemove(item.foodName)}>Remove</button>
            </div>
          );
        })}
      </div>

      {Object.keys(selectedItems).length > 0 && (
        <div className="selection-summary">
          <h3>🧾 Selected Items</h3>
          <ul>
            {Object.values(selectedItems).map((item, index) => (
              <li key={index}>
                {item.foodName} × {item.quantity} = ₹{item.quantity * item.price}
              </li>
            ))}
          </ul>
          <h3 className="total-amount">Total Price: ₹{totalPrice}</h3>

          <form className="order-form" onSubmit={handleOrderSubmit}>
            <h4>Customer Details</h4>
            <input
              type="text"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">✅ Place Order</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MenuPanel;*/
