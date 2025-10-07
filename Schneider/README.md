# Factory Floor Monitor Dashboard

A professional web-based dashboard for monitoring the status of production line PCs in a factory environment. This application provides a blueprint-style view of the shop floor with real-time PC status monitoring and detailed inventory management.

## Features

### 🏭 Factory Floor Layout
- **Blueprint-style visualization** of the shop floor
- **Production lines** clearly marked and labeled
- **PC locations** represented as colored dots on the layout
- **Grid-based design** for precise positioning
- **Responsive layout** suitable for large control room displays

### 💻 PC Status Monitoring
- **Real-time status indicators**:
  - 🟢 Green: OK (≤3 days since last reboot)
  - 🟡 Yellow: Reboot Due (4-7 days since last reboot)
  - 🔴 Red: Critical (>7 days since last reboot)
- **Dynamic color changes** based on reboot timing
- **Hover tooltips** with quick PC information
- **Click interactions** for detailed PC information

### 📊 PC Information Display
- **IP Address** tracking
- **PC Configuration** details (CPU, RAM, Disk)
- **Last Reboot Time** with formatted display
- **Production Line** assignment
- **System Status** indicators

### 📋 Sortable Inventory Table
- **Complete PC inventory** in tabular format
- **Sortable columns** (Name, IP, Status, Last Reboot)
- **Status summaries** with counts
- **Clickable rows** for detailed information
- **Professional styling** with hover effects

### 🎨 Professional UI/UX
- **Dark theme** optimized for industrial environments
- **Modern design** with Tailwind CSS
- **Responsive layout** for various screen sizes
- **Professional typography** with Inter and JetBrains Mono fonts
- **Smooth animations** and transitions

## Technology Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **date-fns** - Date manipulation utilities
- **Create React App** - Development environment

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download** the project files

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── FloorLayout.js      # Main floor layout component
│   ├── PCDot.js           # Individual PC dot component
│   ├── PCTable.js         # Sortable PC inventory table
│   └── PCDetailsModal.js  # PC details modal
├── data/
│   └── mockData.js        # Mock data for factory floor
├── utils/
│   └── statusUtils.js     # Utility functions for status calculations
├── App.js                 # Main application component
├── index.js              # Application entry point
└── index.css             # Global styles and Tailwind imports
```

## Data Structure

The application uses mock data that can be easily replaced with real API calls. The data structure includes:

- **Factory floor dimensions** and layout
- **Production lines** with positions and dimensions
- **PC information** including:
  - Unique identifiers
  - IP addresses
  - Hardware specifications
  - Last reboot timestamps
  - Production line assignments

## Customization

### Adding New PCs
Edit `src/data/mockData.js` to add new PC entries with the required fields:
- `id`: Unique identifier
- `name`: PC display name
- `ipAddress`: IP address
- `x`, `y`: Position on floor layout
- `cpu`, `ram`, `disk`: Hardware specifications
- `lastReboot`: ISO timestamp
- `status`: Online/offline status
- `productionLine`: Associated production line

### Modifying Status Logic
Edit `src/utils/statusUtils.js` to customize:
- Status thresholds (currently 3 and 7 days)
- Status labels and colors
- Date formatting

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Edit `src/index.css` for custom component styles
- Update component classes for visual changes

## Future Enhancements

The application is designed to be easily extensible for future features:

- **Real-time data integration** via WebSocket or REST API
- **Alert system** for critical PC status
- **Remote PC management** capabilities
- **Historical data** and trend analysis
- **User authentication** and role-based access
- **Export functionality** for reports
- **Mobile responsiveness** for tablet devices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is created for demonstration purposes and can be used as a foundation for industrial monitoring systems.

## Support

For questions or issues, please refer to the code comments or create an issue in the project repository. 