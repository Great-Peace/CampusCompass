# CampusCompass 🧭

A comprehensive campus navigation and community platform that helps students explore their campus, discover interesting spots, and connect with fellow students.

## ✨ Features

- 🗺️ **Interactive Campus Map** - Navigate campus with real-time GPS and route planning
- 📍 **Location Search** - Find classrooms, offices, libraries, and more
- 📊 **Occupancy Tracking** - Check real-time crowd levels at campus locations
- ⭐ **Campus Spots** - Discover and share recommendations for food, study areas, and activities
- 👥 **Buddy System** - Create and join trips, connect with students
- 🔔 **Real-time Notifications** - Stay updated on trip requests and campus events
- 👨‍💼 **Admin Dashboard** - Content moderation, analytics, and user management

## 🛠️ Tech Stack

**Backend:** NestJS, TypeScript, PostgreSQL, Redis, Socket.io  
**Frontend:** React, TypeScript, Redux, Material-UI, Mapbox  
**Services:** Google OAuth, Firebase FCM, AWS S3

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/campuscompass.git
cd campuscompass
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run start:dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

4. **Create Database**
```bash
psql -U postgres
CREATE DATABASE campuscompass;
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1
- API Docs: http://localhost:3000/api/v1/docs

## 📁 Project Structure

```
campuscompass/
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── database/ # Entities & repositories
│   │   └── common/   # Shared utilities
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/campuscompass
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 📚 API Documentation

Once running, visit the Swagger documentation at:  
`http://localhost:3000/api/v1/docs`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- CMU for the inspiration
- Mapbox for mapping services
- Material-UI for the component library

---

**Note:** This project was developed as part of a campus navigation initiative. Make sure to configure all API keys and environment variables before running.
