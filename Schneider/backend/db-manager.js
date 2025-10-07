const { db, dbOperations } = require('./database');

console.log('=== Schneider PC Monitor Database Manager ===\n');

// Function to display menu
function showMenu() {
  console.log('Available operations:');
  console.log('1. View all PCs');
  console.log('2. View PC details');
  console.log('3. View PC metrics');
  console.log('4. View system statistics');
  console.log('5. Reset database');
  console.log('6. Export database');
  console.log('7. Exit');
  console.log('');
}

// Function to handle user input
function handleInput(choice) {
  switch(choice) {
    case '1':
      console.log('\n=== All PCs ===');
      const pcs = dbOperations.getAllPCs();
      pcs.forEach(pc => {
        console.log(`${pc.name} (${pc.id}) - Status: ${pc.status} - IP: ${pc.ip_address}`);
      });
      break;
      
    case '2':
      console.log('\n=== PC Details ===');
      console.log('Available PC IDs:');
      const allPCs = dbOperations.getAllPCs();
      allPCs.forEach(pc => {
        console.log(`- ${pc.id} (${pc.name})`);
      });
      console.log('');
      
      // For command line usage, show details for first PC
      if (allPCs.length > 0) {
        const firstPC = allPCs[0];
        console.log(`Showing details for: ${firstPC.id}`);
        console.log(JSON.stringify(firstPC, null, 2));
        
        // Show all PCs in a table format
        console.log('\n=== All PCs Details ===');
        allPCs.forEach(pc => {
          console.log(`\n${pc.name} (${pc.id}):`);
          console.log(`  Status: ${pc.status}`);
          console.log(`  IP: ${pc.ip_address}`);
          console.log(`  CPU: ${pc.cpu}`);
          console.log(`  RAM: ${pc.ram}`);
          console.log(`  Disk: ${pc.disk}`);
          console.log(`  Production Line: ${pc.production_line}`);
          console.log(`  Last Reboot: ${pc.last_reboot}`);
          console.log(`  Updated: ${pc.updated_at}`);
        });
      }
      break;
      
    case '3':
      console.log('\n=== PC Metrics ===');
      const pcsForMetrics = dbOperations.getAllPCs();
      if (pcsForMetrics.length > 0) {
        pcsForMetrics.forEach(pc => {
          console.log(`\n--- Metrics for ${pc.name} (${pc.id}) ---`);
          const metrics = dbOperations.getPCMetrics(pc.id, 24);
          console.log(`Found ${metrics.length} records in last 24 hours`);
          
          if (metrics.length > 0) {
            console.log('Latest 3 records:');
            metrics.slice(0, 3).forEach(metric => {
              console.log(`  ${metric.timestamp}: CPU: ${metric.cpu_usage}, RAM: ${metric.ram_usage}, Disk: ${metric.disk_usage}, Status: ${metric.status}`);
            });
          } else {
            console.log('  No metrics found (PC may be offline)');
          }
        });
      }
      break;
      
    case '4':
      console.log('\n=== System Statistics ===');
      const stats = dbOperations.getSystemStats();
      console.log(`Total PCs: ${stats.total_pcs}`);
      console.log(`Online PCs: ${stats.online_pcs}`);
      console.log(`Offline PCs: ${stats.offline_pcs}`);
      
      // Additional stats
      const allPCsForStats = dbOperations.getAllPCs();
      console.log('\n=== PC Status Summary ===');
      allPCsForStats.forEach(pc => {
        console.log(`${pc.name}: ${pc.status.toUpperCase()}`);
      });
      break;
      
    case '5':
      console.log('\n=== Reset Database ===');
      console.log('This will delete all data and recreate tables.');
      console.log('⚠️  WARNING: This action cannot be undone!');
      console.log('To reset, run: node db-manager.js reset');
      break;
      
    case '6':
      console.log('\n=== Export Database ===');
      const fs = require('fs');
      const path = require('path');
      const dbPath = path.join(__dirname, 'schneider_monitor.db');
      const exportPath = path.join(__dirname, `schneider_monitor_backup_${new Date().toISOString().split('T')[0]}.db`);
      
      try {
        fs.copyFileSync(dbPath, exportPath);
        console.log(`✅ Database exported to: ${exportPath}`);
        console.log(`📁 Original: ${dbPath}`);
        console.log(`📁 Backup: ${exportPath}`);
      } catch (error) {
        console.error('❌ Export failed:', error.message);
      }
      break;
      
    case '7':
      console.log('Goodbye!');
      process.exit(0);
      break;
      
    default:
      console.log('Invalid choice. Please try again.');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  showMenu();
}

// Check for command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  // Command line mode
  const command = args[0];
  
  switch(command) {
    case 'pcs':
    case '1':
      console.log('=== All PCs ===');
      const pcs = dbOperations.getAllPCs();
      pcs.forEach(pc => {
        console.log(`${pc.name} (${pc.id}) - Status: ${pc.status} - IP: ${pc.ip_address}`);
      });
      break;
      
    case 'details':
    case '2':
      console.log('=== PC Details ===');
      const allPCs = dbOperations.getAllPCs();
      allPCs.forEach(pc => {
        console.log(`\n${pc.name} (${pc.id}):`);
        console.log(`  Status: ${pc.status}`);
        console.log(`  IP: ${pc.ip_address}`);
        console.log(`  CPU: ${pc.cpu}`);
        console.log(`  RAM: ${pc.ram}`);
        console.log(`  Disk: ${pc.disk}`);
        console.log(`  Production Line: ${pc.production_line}`);
        console.log(`  Last Reboot: ${pc.last_reboot}`);
        console.log(`  Updated: ${pc.updated_at}`);
      });
      break;
      
    case 'metrics':
    case '3':
      console.log('=== PC Metrics ===');
      const pcsForMetrics = dbOperations.getAllPCs();
      pcsForMetrics.forEach(pc => {
        console.log(`\n--- Metrics for ${pc.name} (${pc.id}) ---`);
        const metrics = dbOperations.getPCMetrics(pc.id, 24);
        console.log(`Found ${metrics.length} records in last 24 hours`);
        
        if (metrics.length > 0) {
          console.log('Latest 3 records:');
          metrics.slice(0, 3).forEach(metric => {
            console.log(`  ${metric.timestamp}: CPU: ${metric.cpu_usage}, RAM: ${metric.ram_usage}, Disk: ${metric.disk_usage}, Status: ${metric.status}`);
          });
        } else {
          console.log('  No metrics found (PC may be offline)');
        }
      });
      break;
      
    case 'stats':
    case '4':
      console.log('=== System Statistics ===');
      const stats = dbOperations.getSystemStats();
      console.log(`Total PCs: ${stats.total_pcs}`);
      console.log(`Online PCs: ${stats.online_pcs}`);
      console.log(`Offline PCs: ${stats.offline_pcs}`);
      
      const allPCsForStats = dbOperations.getAllPCs();
      console.log('\n=== PC Status Summary ===');
      allPCsForStats.forEach(pc => {
        console.log(`${pc.name}: ${pc.status.toUpperCase()}`);
      });
      break;
      
    case 'reset':
    case '5':
      console.log('=== Resetting Database ===');
      db.exec('DELETE FROM pc_metrics');
      db.exec('DELETE FROM pcs');
      console.log('✅ Database reset. Restart the server to reinitialize.');
      break;
      
    case 'export':
    case '6':
      console.log('=== Export Database ===');
      const fs = require('fs');
      const path = require('path');
      const dbPath = path.join(__dirname, 'schneider_monitor.db');
      const exportPath = path.join(__dirname, `schneider_monitor_backup_${new Date().toISOString().split('T')[0]}.db`);
      
      try {
        fs.copyFileSync(dbPath, exportPath);
        console.log(`✅ Database exported to: ${exportPath}`);
      } catch (error) {
        console.error('❌ Export failed:', error.message);
      }
      break;
      
    default:
      console.log('Usage: node db-manager.js [command]');
      console.log('Commands:');
      console.log('  pcs, 1     - View all PCs');
      console.log('  details, 2 - View PC details');
      console.log('  metrics, 3 - View PC metrics');
      console.log('  stats, 4   - View system statistics');
      console.log('  reset, 5   - Reset database');
      console.log('  export, 6  - Export database');
  }
} else {
  // Interactive mode
  showMenu();
  
  // Handle user input
  process.stdin.on('data', (data) => {
    const choice = data.toString().trim();
    handleInput(choice);
  });
  
  console.log('Enter your choice (1-7): ');
} 