# Schneider PC Monitor Database Setup

## Overview
This system uses **SQLite** as the database for storing PC monitoring data. SQLite was chosen for its simplicity, zero-configuration setup, and excellent performance for this use case.

## Database Features

### ✅ Why SQLite is Perfect for Your Project:
- **Zero Setup**: No server installation or configuration required
- **File-based**: Single database file that's easy to backup and deploy
- **Lightweight**: Minimal memory footprint and dependencies
- **Real-time Ready**: Excellent for storing time-series data from your PCs
- **Node.js Integration**: Works seamlessly with Express.js

### 📊 Database Schema

#### 1. `pcs` Table - PC Information
```sql
- id (TEXT, PRIMARY KEY) - PC identifier (e.g., "pc-fin1-1")
- name (TEXT) - Display name (e.g., "Finishing1-PC1")
- ip_address (TEXT) - IP address
- status (TEXT) - Current status (online/offline)
- cpu (TEXT) - CPU specification
- ram (TEXT) - RAM specification
- disk (TEXT) - Disk specification
- last_reboot (TEXT) - Last reboot timestamp
- production_line (TEXT) - Production line assignment
- created_at (DATETIME) - Record creation time
- updated_at (DATETIME) - Last update time
```

#### 2. `pc_metrics` Table - Historical Performance Data
```sql
- id (INTEGER, PRIMARY KEY) - Auto-incrementing ID
- pc_id (TEXT) - Reference to PC
- cpu_usage (TEXT) - CPU usage percentage
- ram_usage (TEXT) - RAM usage percentage
- disk_usage (TEXT) - Disk usage percentage
- status (TEXT) - Status at time of measurement
- timestamp (DATETIME) - Measurement timestamp
```

#### 3. `users` Table - Admin Authentication
```sql
- id (INTEGER, PRIMARY KEY) - Auto-incrementing ID
- username (TEXT, UNIQUE) - Username
- password_hash (TEXT) - Bcrypt hashed password
- role (TEXT) - User role (admin)
- created_at (DATETIME) - Account creation time
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install better-sqlite3
```

### 2. Start the Server
```bash
npm start
```

The database will be automatically created and initialized when the server starts.

### 3. Default Credentials
- **Username**: `admin`
- **Password**: `1234`

## 📁 Database Files

- **Main Database**: `schneider_monitor.db` (created automatically)
- **Backup Files**: `schneider_monitor_backup_YYYY-MM-DD.db`

## 🛠️ Database Management

### Using the Database Manager
```bash
cd backend
node db-manager.js
```

**Available Operations:**
1. View all PCs
2. View PC details
3. View PC metrics (last 24 hours)
4. View system statistics
5. Reset database
6. Export database
7. Exit

### Manual Database Operations

#### View All PCs
```javascript
const { dbOperations } = require('./database');
const pcs = dbOperations.getAllPCs();
console.log(pcs);
```

#### Get PC Metrics
```javascript
const metrics = dbOperations.getPCMetrics('pc-fin1-1', 24); // Last 24 hours
```

#### System Statistics
```javascript
const stats = dbOperations.getSystemStats();
console.log(`Online: ${stats.online_pcs}, Offline: ${stats.offline_pcs}`);
```

## 🔄 API Endpoints

### PC Data
- `GET /api/pcs` - Get all PCs
- `GET /api/pc/:id` - Get specific PC
- `POST /api/pc/update` - Update PC data

### Historical Data
- `GET /api/pc/:id/metrics?hours=24` - Get PC metrics

### System
- `GET /api/stats` - System statistics
- `POST /api/admin/login` - Admin authentication

## 📈 Data Flow

1. **PC Monitoring Scripts** (PowerShell) collect system metrics every 30 seconds
2. **Data sent to server** via POST `/api/pc/update`
3. **Server stores data** in both `pcs` (current state) and `pc_metrics` (historical)
4. **Frontend displays** real-time data from `pcs` table
5. **Historical analysis** available from `pc_metrics` table

## 🔧 Maintenance

### Backup Database
```bash
# Using the manager
node db-manager.js
# Choose option 6

# Or manually
cp schneider_monitor.db schneider_monitor_backup_$(date +%Y-%m-%d).db
```

### Clean Old Data
```sql
-- Remove metrics older than 30 days
DELETE FROM pc_metrics WHERE timestamp < datetime('now', '-30 days');
```

### Reset Database
```bash
node db-manager.js
# Choose option 5
```

## 🚨 Troubleshooting

### Database Locked
- Ensure no other processes are accessing the database
- Check if the server is running
- Restart the server if needed

### Performance Issues
- The database uses WAL mode for better concurrent access
- Consider cleaning old metrics data periodically
- Monitor database file size

### Migration from In-Memory
- The system automatically migrates from the old in-memory storage
- All existing PC configurations are preserved
- Historical data starts from the migration point

## 📊 Performance Considerations

- **WAL Mode**: Enabled for better concurrent access
- **Indexes**: Automatically created on primary keys
- **Data Retention**: Metrics stored indefinitely (clean manually if needed)
- **File Size**: Monitor `schneider_monitor.db` size

## 🔐 Security Notes

- Passwords are hashed using bcrypt
- Database file should be protected from unauthorized access
- Consider encrypting the database file for production use
- Regular backups are recommended

---

**Database Location**: `backend/schneider_monitor.db`
**Manager Script**: `backend/db-manager.js`
**Database Module**: `backend/database.js` 