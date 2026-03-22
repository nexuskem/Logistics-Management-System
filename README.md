# Logistics & Fleet Management System (LMS)

## 1. Project Overview & Requirements
The Logistics & Fleet Management System (LMS) is a comprehensive web application designed to help transportation and logistics companies manage their core operations. It aims to digitize the entire fleet lifecycle, from vehicle maintenance to trip scheduling, driver assignment, client management, and invoicing.

**Core Requirements:**
- **Authentication & Authorization**: Secure login, registration, and password recovery, alongside role-based access control (Super Admin, Operations Manager, Finance Officer, Client).
- **Fleet Management**: Track vehicles (trucks, vans, motorbikes), their capacity, and current statuses (Available, On-Trip, Under Maintenance).
- **Driver Management**: Maintain a roster of drivers, tracking their licenses, availability, and trip assignments.
- **Trip & Route Planning**: Schedule trips, assign drivers and vehicles to specific routes, and track trip statuses from dispatch to delivery.
- **Client & Invoicing**: Manage client profiles, generate invoices for trips, and track payment statuses.
- **Expense & Fuel Tracking**: Log fuel consumption and operational expenses per trip or vehicle.
- **Real-Time Tracking**: (Planned/Implemented) Live vehicle tracking and status monitoring using map interfaces.

---

## 2. Technology Stack
**Frontend:**
- **React.js (v18)** via Vite for fast development
- **React Router DOM** for client-side routing
- **Tailwind CSS** for modern, responsive, and dynamic UI styling
- **Context API** for global state management (Authentication context)
- **Recharts** for dashboard analytics and visualizations
- **Leaflet / React-Leaflet** for embedded maps and vehicle tracking

**Backend:**
- **Node.js & Express.js** for the RESTful API
- **Prisma ORM** for elegant database modeling, type-safety, and migrations
- **JSON Web Token (JWT)** for secure, stateless authentication
- **Bcryptjs** for secure password hashing

**Database & Infrastructure:**
- **MySQL 8.0** as the primary relational database
- **Docker & Docker Compose** for deterministic database deployments locally

---

## 3. Database Architecture
The application is powered by a robust relational schema mapped via Prisma. Key models include:
- **`User`**: Manages system access. Controls roles (`SUPER_ADMIN`, `OPERATIONS_MANAGER`, `FINANCE_OFFICER`, `CLIENT`) and stores password reset tokens for the recovery flow.
- **`Vehicle`**: Stores vehicle metadata (plate, capacity, make, model) and operational status.
- **`Driver`**: Stores driver details, license expiry, and availability.
- **`Client`**: Stores client contact details and corporate information.
- **`Route`**: Defines common origin-destination pairs, geographical distances, and estimated times.
- **`Trip`**: The core operational model. It links a Vehicle, Driver, Client, and Route together, maintaining logs of scheduling, dispatch, and delivery timestamps.
- **`Invoice`**: Links to a Trip and Client to manage billing (Amount, VAT, Overdue tracking, M-Pesa References).
- **`Expense` / `FuelLog` / `Maintenance`**: Micro-ledger tracking of all operational costs distributed across fleets and trips.

---

## 4. Key Features Implemented
### 🔐 Security & Identity
- **JWT-Based Authentication**: Secure session handling.
- **Registration Flow**: New users can securely sign up.
- **Forgot/Reset Password**: A self-service recovery flow utilizing securely generated time-limited database tokens.

### 📊 Dashboard & UI
- **Modern Interface**: A sleek dark-mode UI with a collapsible sidebar and informative top navigation bar highlighting key metrics dynamically.
- **Role-Based Protected Routes**: Frontend route guarding ensuring users must be systematically authenticated.

### 🚚 Operational Modules (REST APIs & UI)
- **Vehicles, Drivers, and Clients**: Comprehensive CRUD support linking database models to fully-styled React pages.
- **Trips**: Robust state management mapping trips to their corresponding logistic links.
- **Finance**: Operational insights via invoices and expenses interfaces.

---

## 5. Setup & Installation Guide

### Prerequisites
- Node.js (v18+)
- Local MySQL instance OR Docker Desktop

### 1. Database Setup
You can either use the provided Docker configuration or a local MySQL server.
**Using Docker:**
```bash
docker-compose up -d
```
*(Ensure your credentials match the `.env` configuration below)*

### 2. Backend Configuration
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
Configure your environment variables in `server/.env`:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/logistics_db"
JWT_SECRET="supers3cr3tjwtk3y_for_dev_only_"
PORT=5000
```
Synchronize the database schemas using Prisma:
```bash
npx prisma db push
```
Start the API Server:
```bash
node index.js
```

### 3. Frontend Configuration
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```
Start the Vite development web server:
```bash
npm run dev
```

### 4. Running the Application
1. Once both servers are running successfully, open your browser and navigate to `http://localhost:5173`.
2. Click **Sign Up** on the authentication page to create your initial administrative account.
3. Access the dashboard to begin creating your vehicles, registering drivers, and assigning logistic trips!
