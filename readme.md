# Valley Liquor Store Inventory System

A lightweight, browser-based **Inventory Management System** designed for retail operations. This application allows users to manage product stock levels in real-time using an integrated local SQL database.

---

## 🚀 Key Features

### 📂 Dynamic Navigation & Categorization
* **Intuitive Sidebar:** A sliding navigation menu (accessible via the animated bottle icon) that allows users to switch between product departments (Beers, Wines, Spirits) instantly. 
* **State-Driven UI:** The interface dynamically toggles section visibility to maintain a focused and clean workspace.

### 🔍 Real-Time Searching
* **Instant Filtering:** A polished, pill-style search bar integrated into the navigation header that filters products by **Company/Brand** or **Product Name**.
* **Responsive Layout:** The product grid updates instantly as you type, allowing for rapid inventory lookup during floor shifts.

### 📦 Robust Product Management
* **SQL-Backed Storage:** Utilizes **SQL.js** to run a relational database directly in the browser, ensuring structured data management for product details and stock counts.
* **Smart Product Entry:** A dedicated modal for adding new inventory with:
    * **Automatic Image Handling:** Built-in logic that validates file sizes (64MB limit) and automatically applies a default placeholder if an image is missing, corrupt, or too large.
    * **Quick-Stock Updates:** Inline quantity controls on every product card for rapid "on-the-floor" adjustments without leaving the main view.

---

## 🛠️ Technical Stack

* **Frontend:** HTML5, CSS3 (Custom Flexbox layouts), Bootstrap 4.5
* **Database:** SQL.js (SQLite compiled to WebAssembly)
* **Scripting:** JavaScript (ES6+), jQuery
* **Storage:** Browser LocalStorage (used for persisting the SQL database state across sessions)

---

## 📸 Interface & UX
* **Mobile-Optimized:** Designed with a responsive grid (using `col-6` and `col-md-4`) to ensure the tool is fully functional on mobile devices and tablets used within the store.
* **Branding:** Features a professional "Dark Cherry" retail theme (`#5E1224`) for a modern, high-contrast user experience.

---

## ⚙️ Installation & Usage
1. Clone the repository to your local machine.
2. Ensure the `./Resources/` folder contains your `script.js`, `defaultLiquorImg.png`, and `navBtn.png`.
3. Open `index.html` in any modern web browser.
4. **Note:** This is a client-side application. No server-side setup (Node.js/Python) is required, as the database engine runs entirely within the browser.

---

## 📝 License
This project was developed for internal inventory management and portfolio demonstration.
protected by MIT License

Copyright (c) 2022 Haoyu Zhang