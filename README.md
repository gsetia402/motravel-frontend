# Motravel Frontend - React Vehicle Rental App

A modern React frontend application built with Vite and Tailwind CSS that connects to the Motravel Spring Boot backend for vehicle rental services.

## 🚀 Features

- **Vehicle Browsing**: View all available vehicles with detailed information
- **Search & Filter**: Filter vehicles by type, price range, and search terms
- **Vehicle Details**: Detailed view of individual vehicles with booking options
- **Responsive Design**: Clean, modern UI that works on all devices
- **Real-time Data**: Fetches live data from Spring Boot backend
- **Routing**: Client-side routing with React Router

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Spring Boot backend** running on `http://localhost:8080`

## 🛠️ Installation & Setup

### 1. Clone/Navigate to the project directory
```bash
cd /Users/anubhutijadaun/Documents/Idea\ Projects/motravel-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
motravel-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── VehicleCard.jsx # Vehicle card component
│   │   ├── SearchFilter.jsx # Search and filter component
│   │   └── LoadingSpinner.jsx # Loading indicator
│   ├── pages/              # Page components
│   │   ├── VehicleList.jsx # Vehicle listing page
│   │   └── VehicleDetail.jsx # Vehicle detail page
│   ├── services/           # API services
│   │   └── api.js          # Axios configuration and API calls
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration with proxy
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🔌 API Integration

The app connects to your Spring Boot backend through a proxy configuration. All API calls to `/api/*` are automatically forwarded to `http://localhost:8080`.

### Supported Endpoints:
- `GET /api/vehicles` - Fetch all vehicles
- `GET /api/vehicles/{id}` - Fetch specific vehicle details
- `GET /api/vehicles/available` - Fetch available vehicles
- `GET /api/vehicles/nearby` - Find vehicles near location

## 🎨 UI Components

### VehicleList Page (`/`)
- Displays grid of vehicle cards
- Search bar for filtering by brand/model
- Filter by vehicle type (Car, Motorcycle, Scooter, Bike)
- Price range filtering
- Responsive grid layout

### VehicleDetail Page (`/vehicle/:id`)
- Detailed vehicle information
- Large vehicle image or icon
- Pricing information
- Availability status
- Location details
- Booking buttons (UI only - requires authentication)

### Components
- **Header**: Navigation with Motravel branding
- **VehicleCard**: Individual vehicle preview card
- **SearchFilter**: Advanced filtering options
- **LoadingSpinner**: Loading state indicator

## 🚦 Running the Complete Application

### 1. Start the Spring Boot Backend
Make sure your Spring Boot application is running on `http://localhost:8080`:
```bash
cd /path/to/your/spring-boot-project
./mvnw spring-boot:run
```

### 2. Start the React Frontend
```bash
cd /Users/anubhutijadaun/Documents/Idea\ Projects/motravel-frontend
npm run dev
```

### 3. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## 🔍 Testing the Application

1. **Vehicle List**: Visit `http://localhost:5173` to see all vehicles
2. **Search**: Use the search bar to filter vehicles by brand/model
3. **Filter**: Use dropdowns to filter by type and price range
4. **Vehicle Details**: Click any vehicle card to view detailed information
5. **Navigation**: Use browser back/forward buttons or the "Back to Vehicles" link

## 🛠️ Customization

### Adding New Vehicle Types
Update the vehicle type options in `src/components/SearchFilter.jsx`:
```jsx
<option value="NEW_TYPE">New Type</option>
```

### Styling Changes
Modify `tailwind.config.js` for theme customization or update component styles directly.

### API Configuration
Update `src/services/api.js` to modify API endpoints or add authentication.

## 🐛 Troubleshooting

### Common Issues:

1. **"Failed to fetch vehicles"**
   - Ensure Spring Boot backend is running on `http://localhost:8080`
   - Check browser console for CORS errors
   - Verify API endpoints are accessible

2. **Styling not loading**
   - Run `npm install` to ensure Tailwind CSS is installed
   - Check that `postcss.config.js` and `tailwind.config.js` are present

3. **Routing issues**
   - Ensure React Router is properly installed
   - Check that `BrowserRouter` is wrapping the App component

4. **Proxy not working**
   - Verify `vite.config.js` proxy configuration
   - Restart the development server after config changes

## 📦 Dependencies

### Main Dependencies:
- **React 18.2.0** - UI library
- **React Router DOM 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client for API calls

### Development Dependencies:
- **Vite 4.5.0** - Build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **ESLint** - Code linting

## 🚀 Production Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📝 Notes

- The application is configured to work with your existing Spring Boot backend
- Vehicle images are supported via the `imageUrl` field from the API
- Booking functionality requires authentication (UI prepared for future implementation)
- The app is fully responsive and works on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy coding! 🚗💨**
