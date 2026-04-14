# 🛍️ ShopHub - E-Commerce & Service Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

## 📋 Project Overview

**ShopHub** is a comprehensive full-stack e-commerce platform combined with a service management system. Unlike traditional e-commerce websites, ShopHub integrates three distinct user roles (Manager, Employee, Customer) into a single ecosystem, enabling seamless product management, order processing, delivery assignment, attendance tracking, and customer purchasing.

The platform simulates real-world operations like Flipkart/Dmart but adds an enterprise layer where managers can assign deliveries to employees, employees can track their daily attendance and update delivery status, while customers enjoy a complete shopping experience.

## 🎯 Objectives

- Build a unified system handling both customer purchases and internal service management
- Implement role-based access control with three distinct dashboards
- Enable real-time order management and delivery assignment
- Provide employee attendance tracking with daily check-in/out
- Deliver full e-commerce functionality (browsing, cart, checkout, payments)
- Create a responsive, modern UI with animations and dark mode

## ✨ Key Features

### 🔐 Common Features (All Roles)
- JWT Authentication (Login/Signup)
- Dark Mode Toggle
- Fully Responsive Design
- Modern UI with Animations
- Toast Notifications

### 👔 Manager Dashboard
- ✅ Add, Edit, Delete Products
- ✅ View All Users (Customers & Employees)
- ✅ View All Orders with Status
- ✅ Assign Delivery Tasks to Employees
- ✅ Analytics Chart (Order status distribution)
- ✅ Manage Product Inventory

### 👷 Employee Dashboard
- ✅ Daily Check-In / Check-Out (once per day)
- ✅ View Assigned Deliveries
- ✅ Access Customer Address Details
- ✅ Update Delivery Status (Out for Delivery / Delivered)
- ✅ View Personal Attendance History

### 🛒 Customer Dashboard
- ✅ Browse 1000+ Products (Grid/Card Layout)
- ✅ Search Products by Name
- ✅ Filter by Category
- ✅ Add to Cart (Dynamic Updates)
- ✅ Manage Multiple Addresses
- ✅ Checkout with Payment Methods:
  - Cash on Delivery (COD)
  - BHIM UPI Simulation
- ✅ View Order Summary & History

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure of web pages |
| CSS3 | Styling, animations, responsive design |
| JavaScript (ES6+) | Client-side logic, API calls |
| Bootstrap 5 | Responsive grid, components, modals |
| Font Awesome 6 | Icons |
| Chart.js | Manager dashboard analytics |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework for REST APIs |
| JWT (jsonwebtoken) | Authentication & authorization |
| bcryptjs | Password hashing |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | NoSQL database |
| Mongoose | ODM for schema modeling |

## 📁 Project Structure
