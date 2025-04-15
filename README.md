# Moroccan Handicrafts Classified Board - Backend

A powerful Express.js backend that drives a classified ads platform specifically designed for Moroccan handicrafts, with MySQL database integration and robust image management.

## ✨ Features

- **📋 Complete CRUD Operations** - RESTful API endpoints to create, read, update and delete advertisements
- **🔐 Secure Access System** - Each ad receives a unique 6-digit access code for management
- **📸 Image Management** - Secure image uploads with randomized filenames for privacy
- **📊 Statistics & Analytics** - Admin endpoints providing platform usage metrics
- **🧠 Smart Organization** - Category-based filtering and organization

## 🛠️ Tech Stack

- **🟢 Runtime**: Node.js
- **⚡ Framework**: Express.js
- **🐬 Database**: MySQL
- **📁 File Handling**: Multer

## 📋 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ads` | Create a new advertisement |
| `GET` | `/ads` | Retrieve all advertisements |
| `GET` | `/ads/:id` | Get a specific advertisement |
| `PUT` | `/ads/:accessCode` | Update an advertisement |
| `DELETE` | `/ads/:accessCode` | Remove an advertisement |
| `GET` | `/categories` | List all available categories |
| `GET` | `/stats` | Retrieve admin statistics |

## 💾 Database Schema

**Table: ads**

| Column | Type | Description |
|--------|------|-------------|
| 🔑 id | INT | Auto-increment primary key |
| 📝 title | VARCHAR | Title of the advertisement |
| 📄 description | TEXT | Detailed description |
| 🏷️ category | VARCHAR | Handicraft category |
| 💰 price | DECIMAL | Listed price |
| 📱 phone | VARCHAR | Contact information |
| 🖼️ image | VARCHAR | Stored image filename |
| 🔐 access_code | VARCHAR(6) | Unique 6-digit management code |
| 🕒 created_at | TIMESTAMP | Creation timestamp |

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Rida-Lad/clasified-ads-board-for-moroccan-handicrafts-Backend.git
cd classified-ads-board-for-moroccan-handicrafts-Backend

# Install dependencies
npm install

# Configure your .env file
touch .env
```

### 🔧 Environment Configuration

Create a `.env` file with the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=handicrafts_ads
PORT=5000
```

> ⚠️ Ensure your MySQL database is running before starting the application.

## 👥 Contributing

Open an issue or submit a PR to improve or suggest features.
