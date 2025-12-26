# multirestaurant  
# 🍽️ Multi-Restaurant Food Ordering System

A **production-ready full-stack Multi-Restaurant Food Ordering Web Application** where users can browse menus from multiple restaurants, place orders, and restaurant owners/admins can manage menus and orders.  
The project is **securely deployed on AWS EC2 with a custom domain**.

🌐 **Live Website:** https://multirestaurant.store  

---

## 🚀 Project Highlights

- Full-stack application using **Spring Boot + React**
- Secure authentication using **JWT**
- Cloud database using **MongoDB Atlas**
- Deployed on **AWS EC2** with **Nginx**
- Custom domain with **SSL certificate**
- Industry-standard project structure & security practices

---

## 🧑‍💻 Tech Stack

### 🔹 Backend (Spring Boot)
- Java
- Spring Boot
- Spring MVC
- Spring Security
- JWT Authentication
- RESTful APIs
- MongoDB Integration
- Maven
- Role-based authorization (Admin / User)
- Environment-based configuration (no secrets in repo)

### 🔹 Frontend (React)
- React.js
- JavaScript (ES6+)
- Axios (API communication)
- Context API (State Management)
- Responsive UI
- Form validation
- Modular component architecture

### 🔹 Database
- **MongoDB Atlas (Cloud Database)**
- Collections for:
  - Users
  - Restaurants
  - Menus
  - Orders
  - Cart items

### 🔹 Deployment & DevOps
- AWS EC2 (Linux server)
- Nginx (Reverse Proxy)
- Custom Domain: **multirestaurant.store**
- SSL Certificate (HTTPS enabled)
- Git & GitHub
- Secure environment variables for secrets

---

## ✨ Features

### 👤 User Features
- User Registration & Login (JWT based)
- Browse multiple restaurants
- View restaurant menus
- Add items to cart
- Place food orders
- Secure session handling

### 🧑‍🍳 Admin / Restaurant Owner Features
- Add & manage food items
- Manage restaurant menus
- View customer orders
- Update order status
- Secure admin access

### 🔐 Security Features
- JWT Authentication
- Role-based access control
- Sensitive data protected via environment variables
- GitHub secret scanning compliant

---

## 📂 Project Structure
multirestaurant/
├── backend/ # Spring Boot Application
│ ├── controller
│ ├── service
│ ├── repository
│ ├── model
│ ├── security
│ └── resources
│
├── frontend/ # React Application
│ ├── components
│ ├── pages
│ ├── services
│ └── context
│
└── README.md

⚙️ How to Run Locally

 🔹 Backend
bash
cd backend
mvn spring-boot:run

🔹 Frontend
bash
Copy code
cd frontend
npm install
npm start

🌐 Deployment Details
Backend deployed on AWS EC2

Frontend served using Nginx

MongoDB hosted on MongoDB Atlas

Custom domain connected: multirestaurant.store

SSL certificate enabled (HTTPS)

🏆 What This Project Demonstrates
Real-world Full-Stack Development

Secure authentication & authorization

Cloud deployment experience (AWS)

Database design & API integration

Clean code & scalable architecture

Industry-standard Git & security practices


👨‍💻 Author

Mahesh Ingle
Java Full Stack Developer
Spring Boot | React | MongoDB | AWS








