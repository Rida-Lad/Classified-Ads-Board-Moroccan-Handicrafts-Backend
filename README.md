
---

## 🚀 **Backend - `classified-ads-board-for-moroccan-handicrafts-Backend`**

# Classified Ads Board for Moroccan Handicrafts - Backend

This Express.js backend powers a classified ads platform for Moroccan handicrafts, storing ads and managing image uploads, using MySQL as the database.

## ⚙️ Features

- 🗃️ RESTful API to create, read, update, delete ads
- 💾 MySQL database for storing ad data
- 📸 Image uploads using Multer
- 🔐 Each ad is assigned a unique 6-digit access code (different from ID)
- 🧹 Uploaded images are saved with randomly generated names to ensure privacy
- 📈 Supports admin stats endpoints for frontend charts

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Image Uploads**: Multer

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/classified-ads-board-for-moroccan-handicrafts-Backend.git
cd classified-ads-board-for-moroccan-handicrafts-Backend

# Install dependencies
npm install

# Configure your .env file
touch .env

```

Example .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=handicrafts_ads
PORT=5000

Make sure your MySQL database is up and running.

📌 API Endpoints
Public Routes
POST /ads - Create new ad

GET /ads - Get all ads

GET /ads/:id - Get single ad

PUT /ads/:accessCode - Update ad

DELETE /ads/:accessCode - Delete ad

GET /categories - List categories

GET /stats - Get admin statistics (used in frontend)

🗃 Example Database Schema
Table: ads

Column	Type	Description
id	INT	Auto-increment primary key
title	VARCHAR	Title of the ad
description	TEXT	Description
category	VARCHAR	Category of the handicraft
price	DECIMAL	Price
phone	VARCHAR	Contact phone
image	VARCHAR	Stored filename
access_code	VARCHAR(6)	Unique 6-digit code
created_at	TIMESTAMP	Creation time
🤝 Contributing
Open an issue or submit a PR to improve or suggest features.
