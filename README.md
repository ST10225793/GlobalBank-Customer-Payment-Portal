# GlobalBank Customer Payment Portal

## 📌 Overview
The **GlobalBank Customer Payment Portal** is a secure web-based system that enables customers to manage and process payments online.  
It provides a user-friendly interface for customers to:
- View account details
- Make payments
- Track payment history
- Access support services

This repository currently contains the **frontend-customer** module. The **backend (Express)** and **frontend-employee** modules will be added as development progresses.

---

## 🛠️ Tech Stack
- **Frontend:** React.js (customer portal)
- **Backend:** Express.js (Node.js framework)
- **Database:** Firebase Realtime Database
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/ST10225793/GlobalBank-Customer-Payment-Portal.git
cd GlobalBank-Customer-Payment-Portal


**### 2. Install Dependencies**
cd frontend-customer
npm install

### 3. Configure Firebase

FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

### 4. Run development servers

cd frontend-customer
npm start

## Project Structure

GlobalBank-Customer-Payment-Portal/
│
├── frontend-customer/   # Customer-facing React app
│   ├── public/          # Static assets
│   ├── src/             # React components, pages, services
│   └── package.json     # Dependencies and scripts
│
├── .gitignore           # Excludes node_modules, build files, logs
└── README.md            # Project documentation

### ⚙️Features

## Customer Portal

Secure login

View account balance

Make payments

View transaction history

## Backend API (Express)

RESTful endpoints

Firebase Realtime Database integration

Authentication & authorization

## Future Enhancements

Employee portal for staff management

Payment gateway integration

Advanced reporting & analytics

### 👨‍💻 Contributing

1. Fork the repo

2. Create a feature branch (git checkout -b feature-name)

3. Commit changes (git commit -m "Add feature")

4. Push to branch (git push origin feature-name)

### 📜 License

This project is licensed under the MIT License
---
Copyright (c) GlobalBank Customer Payment Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


This README gives you a **professional, complete documentation** for your system with Express backend and Firebase Realtime Database.  


