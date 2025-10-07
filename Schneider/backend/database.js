const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'schneider_monitor.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Initialize database tables
function initializeDatabase() {
  console.log('Initializing database...');
  
  // PCs table - stores PC information
  db.exec(`
    CREATE TABLE IF NOT EXISTS pcs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      ip_address TEXT,
      status TEXT DEFAULT 'offline',
      cpu TEXT,
      ram TEXT,
      disk TEXT,
      last_reboot TEXT,
      production_line TEXT,
      x INTEGER DEFAULT 0,
      y INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PC metrics table - stores historical performance data
  db.exec(`
    CREATE TABLE IF NOT EXISTS pc_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pc_id TEXT NOT NULL,
      cpu_usage TEXT,
      ram_usage TEXT,
      disk_usage TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pc_id) REFERENCES pcs (id)
    )
  `);

  // Users table - for admin authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin user if not exists
  const bcrypt = require('bcryptjs');
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  
  if (!adminExists) {
    const passwordHash = bcrypt.hashSync('1234', 10);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin');
    console.log('Default admin user created (username: admin, password: 1234)');
  }

  // Insert default PCs if not exists
  const defaultPCs = [
    // Finishing Line 1 PCs (bottom of left box)
    {
      id: 'sanjai',
      name: 'line1_pc1',
      ip_address: '',
      status: 'offline',
      cpu: 'Unknown',
      ram: 'Unknown',
      disk: 'Unknown',
      last_reboot: new Date().toISOString(),
      production_line: 'finishing-line-1',
      x: 24,  // left dot in left box
      y: 148  // bottom
    },
    {
      id: 'santi',
      name: 'line1_pc2',
      ip_address: '',
      status: 'offline',
      cpu: 'Unknown',
      ram: 'Unknown',
      disk: 'Unknown',
      last_reboot: new Date().toISOString(),
      production_line: 'finishing-line-1',
      x: 30,  // right dot in left box
      y: 148  // bottom
    },
    // Finishing Line 2 PCs (bottom of right box)
    {
      id: 'bhargav',
      name: 'line2_pc1',
      ip_address: '',
      status: 'offline',
      cpu: 'Unknown',
      ram: 'Unknown',
      disk: 'Unknown',
      last_reboot: new Date().toISOString(),
      production_line: 'finishing-line-2',
      x: 50, // left dot in right box
      y: 148  // bottom
    },
    {
      id: 'prassanna',
      name: 'line2_pc2',
      ip_address: '',
      status: 'offline',
      cpu: 'Unknown',
      ram: 'Unknown',
      disk: 'Unknown',
      last_reboot: new Date().toISOString(),
      production_line: 'finishing-line-2',
      x: 56, // right dot in right box
      y: 148  // bottom
    }
  ];

  const insertPC = db.prepare(`
    INSERT OR IGNORE INTO pcs (id, name, ip_address, status, cpu, ram, disk, last_reboot, production_line, x, y)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert the 4 specific PCs
  defaultPCs.forEach(pc => {
    insertPC.run(pc.id, pc.name, pc.ip_address, pc.status, pc.cpu, pc.ram, pc.disk, pc.last_reboot, pc.production_line, pc.x, pc.y);
  });

  console.log('Database initialized successfully - 4 PCs configured for assembly lines');
}

// Helper function to convert database format to frontend format
function convertToFrontendFormat(pc) {
  return {
    id: pc.id,
    name: pc.name,
    ipAddress: pc.ip_address,
    status: pc.status,
    cpu: pc.cpu,
    ram: pc.ram,
    disk: pc.disk,
    lastReboot: pc.last_reboot,
    productionLine: pc.production_line,
    x: pc.x || 0,
    y: pc.y || 0,
    lastSeen: pc.last_seen
  };
}

// Database operations
const dbOperations = {
  // Get all PCs
  getAllPCs() {
    const pcs = db.prepare('SELECT * FROM pcs ORDER BY name').all();
    return pcs.map(convertToFrontendFormat);
  },

  // Get PC by ID
  getPCById(pcId) {
    const pc = db.prepare('SELECT * FROM pcs WHERE id = ?').get(pcId);
    return pc ? convertToFrontendFormat(pc) : null;
  },

  // Create new PC
  createPC(pcId, data) {
    const insertPC = db.prepare(`
      INSERT INTO pcs (id, name, ip_address, status, cpu, ram, disk, last_reboot, production_line, x, y)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Generate a friendly name if not provided
    const name = data.name || `PC-${pcId}`;
    const ipAddress = data.ipAddress || data.ip_address || 'unknown';
    const status = data.status || 'online';
    const cpu = data.cpu || 'Unknown';
    const ram = data.ram || 'Unknown';
    const disk = data.disk || 'Unknown';
    const lastReboot = data.lastReboot || data.last_reboot || new Date().toISOString();
    const productionLine = data.productionLine || data.production_line || 'general';
    const x = data.x || 0;
    const y = data.y || 0;
    
    return insertPC.run(pcId, name, ipAddress, status, cpu, ram, disk, lastReboot, productionLine, x, y);
  },

  // Update PC data
  updatePC(pcId, data) {
    const updateFields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        // Convert frontend field names to database field names
        let dbField = key;
        if (key === 'ipAddress') dbField = 'ip_address';
        if (key === 'productionLine') dbField = 'production_line';
        if (key === 'lastReboot') dbField = 'last_reboot';
        
        updateFields.push(`${dbField} = ?`);
        values.push(data[key]);
      }
    });
    
    // Add last_seen update
    updateFields.push('last_seen = ?');
    values.push(new Date().toISOString());
    
    // Add updated_at update
    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    
    values.push(pcId);
    
    const query = `
      UPDATE pcs 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    return db.prepare(query).run(...values);
  },

  // Insert PC metric
  insertMetric(pcId, data) {
    return db.prepare(`
      INSERT INTO pc_metrics (pc_id, cpu_usage, ram_usage, disk_usage, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(pcId, data.cpu, data.ram, data.disk, data.status);
  },

  // Get PC metrics (last 24 hours)
  getPCMetrics(pcId, hours = 24) {
    return db.prepare(`
      SELECT * FROM pc_metrics 
      WHERE pc_id = ? AND timestamp >= datetime('now', '-${hours} hours')
      ORDER BY timestamp DESC
    `).all(pcId);
  },

  // Authenticate user
  authenticateUser(username, password) {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user) {
      const bcrypt = require('bcryptjs');
      if (bcrypt.compareSync(password, user.password_hash)) {
        return { success: true, user: { id: user.id, username: user.username, role: user.role } };
      }
    }
    return { success: false };
  },

  // Get system statistics
  getSystemStats() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_pcs,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_pcs,
        SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_pcs
      FROM pcs
    `).get();
    
    return stats;
  }
};

// Initialize database on module load
initializeDatabase();

module.exports = { dbOperations };