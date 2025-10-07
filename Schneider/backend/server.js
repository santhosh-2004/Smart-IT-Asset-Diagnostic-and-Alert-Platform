const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { dbOperations } = require('./database');
const app = express();

app.use(cors());
app.use(express.json());

// Root API endpoint - shows available endpoints
app.get('/api', (req, res) => {
  res.json({
    message: 'Schneider Factory Floor Monitor API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      'GET /api/pcs': 'Get all PC data',
      'GET /api/pc/:id': 'Get specific PC data',
      'GET /api/pc/:id/metrics': 'Get PC historical metrics',
      'POST /api/pc/update': 'Update PC data',
      'POST /api/admin/login': 'Admin login',
      'GET /api/stats': 'Get system statistics',
      'GET /api/health': 'Health check',
      'GET /api/pcs/lastseen': 'Get lastSeen for all PCs'
    }
  });
});

// Email configuration
let emailConfig = {
  email: null,
  transporter: null
};

// Load email config from file
function loadEmailConfig() {
  const ADMIN_FILE = './admin.json';
  if (fs.existsSync(ADMIN_FILE)) {
    const data = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    if (data.email) {
      emailConfig.email = data.email;
      // For Gmail, you'll need to use an App Password
      emailConfig.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: data.email,
          pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password-here' // Set this as environment variable
        }
      });
    }
  }
}

// Load email config
loadEmailConfig();

// --- Admin login ---
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const result = dbOperations.authenticateUser(username || 'admin', password);
  
  if (result.success) {
    return res.json({ success: true, user: result.user });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

// API Endpoints
app.get('/api/pcs', (req, res) => {
  try {
    let pcs = dbOperations.getAllPCs();
    const now = Date.now();
    const TIMEOUT = 60 * 1000; // 60 seconds
    pcs = pcs.map(pc => {
      if (pc.lastSeen && (now - new Date(pc.lastSeen).getTime() > TIMEOUT)) {
        pc.status = 'offline';
      }
      return pc;
    });
    res.json(pcs);
  } catch (error) {
    console.error('Error fetching PCs:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/pc/:id', (req, res) => {
  try {
    const pcId = req.params.id;
    const pc = dbOperations.getPCById(pcId);
    
    if (pc) {
      res.json(pc);
    } else {
      res.status(404).json({ error: 'PC not found' });
    }
  } catch (error) {
    console.error('Error fetching PC:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/pc/update', (req, res) => {
  try {
    const { pcId, data } = req.body;
    let pc = dbOperations.getPCById(pcId);
    
    if (pc) {
      // PC exists - update it with real data
      console.log(`PC ${pcId} connected - updating with real data`);
      dbOperations.updatePC(pcId, data);
    } else {
      // PC doesn't exist - this shouldn't happen with our 4 specific PCs
      console.log(`Unknown PC connected: ${pcId}`);
      res.status(404).json({ error: 'PC not found in system' });
      return;
    }
    
    // Store metric for historical tracking
    dbOperations.insertMetric(pcId, data);
    
    console.log(`Updated PC ${pcId}:`, data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating PC:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get PC metrics (historical data)
app.get('/api/pc/:id/metrics', (req, res) => {
  try {
    const pcId = req.params.id;
    const hours = parseInt(req.query.hours) || 24;
    const metrics = dbOperations.getPCMetrics(pcId, hours);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get system statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbOperations.getSystemStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Temporary endpoint to check lastSeen for all PCs
app.get('/api/pcs/lastseen', (req, res) => {
  try {
    const pcs = dbOperations.getAllPCs();
    const result = pcs.map(pc => ({
      id: pc.id,
      name: pc.name,
      status: pc.status,
      lastSeen: pc.lastSeen
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log('Available endpoints:');
  console.log('  GET  /api/pcs - Get all PC data');
  console.log('  GET  /api/pc/:id - Get specific PC data');
  console.log('  GET  /api/pc/:id/metrics - Get PC historical metrics');
  console.log('  POST /api/pc/update - Update PC data');
  console.log('  POST /api/admin/login - Admin login');
  console.log('  GET  /api/stats - Get system statistics');
  console.log('  GET  /api/health - Health check');
  console.log('  GET  /api/pcs/lastseen - Get lastSeen for all PCs');
}); 