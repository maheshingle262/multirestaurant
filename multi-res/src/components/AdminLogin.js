import axios from 'axios';
import { useState } from 'react';
// Use named import instead of default import
import { jwtDecode } from 'jwt-decode';

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/auth/login', form)
      .then(res => {
        const token = res.data.token;
        localStorage.setItem('token', token);

        // Use the imported jwtDecode function
        const decoded = jwtDecode(token);

        const roles = decoded.roles || [];

        if (roles.includes("ROLE_ADMIN")) {
          alert('✅ Admin login successful');
          window.location.href = '/admin';
        } else {
          alert('❌ You are not an admin');
        }
      })
      .catch(() => alert('❌ Invalid credentials'));
  };

  return (
    <div className="admin-login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
  
export default AdminLogin;
