# QuickChat – Real-time Chat Application

A full‑stack real‑time chat application built with the MERN stack and Socket.io, featuring instant messaging, image sharing, onboarding email system, and secure authentication.

## 🚀 Live Demo

[https://quickchat.ismailirshad.in](https://quickchat.ismailirshad.in)

---

## 🧰 Tech Stack

* **Frontend:** React, Zustand, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Real‑Time Engine:** Socket.io
* **Image Storage:** Cloudinary
* **Email Service:** Resend
* **Deployment:** AWS EC2 + NGINX
* **Authentication:** JWT

---

## ⭐ Key Features

* Real‑time messaging with Socket.io
* User authentication using JWT
* Online/offline presence indicators
* Cloudinary image upload & sharing
* Welcome email onboarding via Resend
* Protected routes & rate‑limiting
* Notification sounds & profile updates
* Mobile responsive UI

---

## 📂 Folder Structure

```
Quick-chat/
 ├── backend/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── server.js
 ├── frontend/
 │   ├── src/
 │   ├── public/
 │   └── vite.config.js
 ├── package.json
 └── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Ismailirshad/Quick-chat.git
cd Quick-chat
```

### 2️⃣ Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3️⃣ Environment Variables

Create a `.env` file inside **backend**:

```env
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RESEND_API_KEY=xxx
CLIENT_URL=http://localhost:5173
```

---

## ▶️ Run Locally

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

Backend will run at:

```
http://localhost:3000
```

---

## 🌐 Production Deployment (AWS EC2 + NGINX)

* Build frontend using Vite
* Serve output through NGINX
* Reverse proxy backend to Node server

Example NGINX config:

```nginx
server {
    listen 80;
    server_name quickchat.ismailirshad.in;

    root /var/www/frontend;
    index index.html;

    location /api {
        proxy_pass http://127.0.0.1:3000;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📧 Onboarding Emails (Resend)

New users receive a welcome email upon registration using Resend APIs.

---

## 📸 Screenshots (Add later)

* Login page
* Chat UI
* Image upload window
* Online indicator

---

## 🛡️ Security Measures

* JWT token authentication
* Protected routes
* Password hashing
* CORS policy


## 📄 License
owner:@irshadsha164@gmail.com

----------------------------------------------------Thank you--------------------------------------------------------------------
