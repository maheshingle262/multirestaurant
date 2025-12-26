# 🍽️ Multi-Restaurant Food Ordering System

A **production-ready full-stack Multi-Restaurant Food Ordering Web Application** where users can browse menus from multiple restaurants, place orders, and restaurant owners/admins can manage menus and orders.

The application is **securely deployed on AWS EC2** with a **custom domain and SSL certificate**.

🌐 **Live Website:** https://multirestaurant.store

---

## 🚀 Project Highlights

- Full-stack application using **Spring Boot + React**
- Secure authentication using **JWT**
- Cloud database using **MongoDB Atlas**
- **AWS EC2 deployment with Nginx Reverse Proxy**
- Backend packaged as **Spring Boot JAR**
- Custom domain with **HTTPS (SSL)**
- Industry-standard security & deployment practices

---

## 🧑‍💻 Tech Stack

### 🔹 Backend
- Java
- Spring Boot
- Spring MVC
- Spring Security
- JWT Authentication
- RESTful APIs
- MongoDB Integration
- Maven (Build Tool)
- Role-based authorization (Admin / User)
- Environment variable–based configuration

### 🔹 Frontend
- React.js
- JavaScript (ES6+)
- Axios (API communication)
- Context API (State Management)
- Responsive UI
- Modular component-based architecture

### 🔹 Database
- **MongoDB Atlas (Cloud Database)**
- Collections:
  - Users
  - Restaurants
  - Menus
  - Orders
  - Cart Items

---

## 🛠️ Tools & Infrastructure

- **AWS EC2 (Linux Server)**
- **Nginx Reverse Proxy**
- **Spring Boot JAR Deployment**
- **WinSCP** (File transfer to EC2)
- **SSH (EC2 access)**
- **Git & GitHub**
- Custom Domain: **multirestaurant.store**
- SSL Certificate (HTTPS enabled)

---

## ✨ Features

### 👤 User
- User Registration & Login (JWT)
- Browse multiple restaurants
- View menus
- Add items to cart
- Place orders securely

### 🧑‍🍳 Admin / Restaurant Owner
- Add & manage food items
- Manage restaurant menus
- View and manage customer orders
- Update order status

### 🔐 Security
- JWT-based authentication
- Role-based authorization
- Secrets managed using environment variables
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
│ ├── resources
│ └── pom.xml
│
├── frontend/ # React Application
│ ├── components
│ ├── pages
│ ├── context
│ ├── services
│ └── package.json
│
└── README.md


##⚙️ Build & Run (Local Setup)

##🔹 Backend (Spring Boot)
bash
cd backend
mvn clean package
java -jar target/*.jar
Runs on:
http://localhost:8080

🔹 Frontend (React)
bash
cd frontend
npm install
npm run build
npm start

##🚀 Live Deployment (AWS)

- Frontend & Backend deployed on AWS EC2

- React frontend served using Nginx

- Nginx configured as Reverse Proxy

- Spring Boot application packaged as JAR

- Backend running on port 8080

- Nginx forwards requests from port 80/443 → 8080

- MongoDB Atlas used as cloud database

- Files transferred to EC2 using WinSCP

- Custom domain multirestaurant.store mapped to EC2

- SSL enabled for secure HTTPS access

##🏆 What This Project Demonstrates
- End-to-end Full Stack Development

- Secure REST API design

- Cloud database usage (MongoDB Atlas)

- AWS EC2 production deployment

- Nginx reverse proxy configuration

- Real-world Spring Boot JAR deployment

- Professional Git & security practices

👨‍💻 Autho

   Mahesh Ingle 
Java Full Stack Developer
Spring Boot | React | MongoDB | AWS




