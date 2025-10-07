# Team PC Monitoring Setup Guide

## Overview
Your factory has 4 PCs assigned to finishing lines that need to be monitored:

### **Finishing Line 1:**
- **Sanjai PC** (sanjai) - PC1
- **Santi PC** (santi) - PC2

### **Finishing Line 2:**
- **Bhargav PC** (bhargav) - PC1
- **Prassanna PC** (prassanna) - PC2

---

## How It Works

### **Visual Status:**
- 🟢 **GREEN Circle** = PC is online and connected
- ⚫ **GRAY Circle** = PC is offline (not running the script)

### **Location on Dashboard:**
- Finishing Line 1: 2 PCs positioned at coordinates (20,60) and (80,60)
- Finishing Line 2: 2 PCs positioned at coordinates (100,60) and (160,60)

---

## Setup Instructions for Each Team Member

### **Step 1: Get Your Script**
Each person needs their specific script:

- **Sanjai**: `sanjai_pc_script.ps1`
- **Santi**: `santi_pc_script.ps1` 
- **Bhargav**: `bhargav_pc_script.ps1`
- **Prassanna**: `prassanna_pc_script.ps1`

### **Step 2: Run Your Script**
1. Save your script to your PC
2. Right-click the script → "Run with PowerShell"
3. You should see: `[14:30:15] Data sent successfully for [your-name]`

### **Step 3: Verify Connection**
- Ask the admin to check the dashboard
- Your PC should appear as a **GREEN circle** on the assembly line
- Your PC should show as "online" in the PC table

---

## What Data is Collected
- CPU usage percentage
- RAM usage percentage
- Disk usage percentage
- Current IP address
- Last reboot time
- Online/offline status

---

## Troubleshooting

### **"Connection refused" error**
- Make sure the server is running
- Check if the IP address in the script is correct
- Ensure you're on the same network

### **"PC not found" error**
- Make sure you're using the correct script for your name
- Check that the PC_ID in the script matches your assigned name

### **Script won't run**
- Right-click → "Run with PowerShell"
- Make sure PowerShell execution policy allows scripts

---

## Security Notes
- Only system performance data is sent
- No personal files or information are transmitted
- Data is sent over HTTP (not encrypted)

---

## Stop Monitoring
Press `Ctrl+C` in the PowerShell window to stop the script.

---

**Need help?** Contact your system administrator! 