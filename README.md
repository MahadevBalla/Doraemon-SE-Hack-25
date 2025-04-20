# 📦 Doraemon – Smart Inventory Management for SMBs

Doraemon is a scalable, real-time, multi-user inventory management platform built to help small and medium-sized businesses (SMBs) streamline operations across warehouses, users, and live stock movements. Powered by modern web technologies and AI, it delivers a smart, collaborative, and cost-effective solution.

---

## 🧩 Problem Statement

Many SMBs struggle with inventory control due to:

- Multiple warehouses and decentralized stock  
- Real-time updates from sales, returns, and transfers  
- Outdated, expensive, or inflexible legacy systems  

**Doraemon** aims to solve this with an intuitive, real-time platform that:

- Tracks stock with precision  
- Enables team collaboration with role-based access  
- Offers deep insights and reports  
- Ensures low-stock alerts and expiry tracking  
- Uses AI to make your inventory smarter

---

## 🚀 Features

### 🔐 Role-Based Access Control
- **Admins**: Full access and user management  
- **Managers**: Strategic control over stock  
- **Staff**: Daily operations (add/edit/view stock)  
- Secured via JWT or session-based authentication

### 📊 Dynamic Inventory Dashboard
- Real-time stock updates  
- Visual activity feed for stock movements  
- Alerts for low inventory & expiry  

### 📚 Full Stock Movement History
- Timestamped logs of every transaction  
- Track purchases, returns, transfers  
- Reversible actions with full traceability  

### 📈 Advanced Reports & Analytics
- Visualize trends: fast-moving, slow-moving, and idle items  
- Inventory valuation over time  
- Export reports in CSV or PDF  

### 🏢 Multi-Warehouse Management
- Assign and move products between warehouses  
- View individual or global stock stats  

### ⚠️ Low Stock & Expiry Notifications
- Customizable thresholds and expiry dates  
- Optional email and push alerts for proactive restocking  

### 📥 Bulk Import/Export
- Upload/download inventory via CSV  
- Perfect for large datasets and migrations  

### 🧠 AI-Powered Summarization with Gemini API
- Generate natural-language summaries of inventory logs, stock health, and warehouse status  
- Use Gemini API to help managers get actionable insights instantly  

---

## 💻 Tech Stack

| Layer        | Tech                      |
|--------------|---------------------------|
| Frontend     | React.js, Tailwind CSS    |
| Backend      | Node.js, Express.js       |
| Database     | MongoDB                   |
| AI Integration | Gemini API              |
| Auth         | JWT / Session-based       |
| Reporting    | CSV & PDF Export          |

---

## 📂 Project Structure

```
doraemon/
├── frontend/              # React + Tailwind frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── backend/              # Node + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── utils/
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm
- MongoDB instance (local or Atlas)
- Gemini API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aayush-48/Doreamon.git
   cd Doreamon
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   In `backend/.env`:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the app**
   ```bash
   # From root
   npm run dev
   ```

---

## 📬 Future Enhancements

- Mobile app support  
- Barcode/QR scanning  
- Supplier integrations  
- AI demand forecasting  
- Inventory snapshots and versioning  

---

## 🙌 Acknowledgements

- Google's Gemini API for powering intelligent summaries  
- MongoDB & Express for scalable backend  
- React & Tailwind for modern, responsive UI
