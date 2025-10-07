# Setup Guide for Your Friend's PC

## Quick Setup Steps

### Step 1: Get Your IP Address
Ask your friend (the one running the server) for their IP address:
- **If on same network (LAN)**: Local IP (e.g., `192.168.1.10`)
- **If on different network**: Public IP (e.g., `203.45.67.89`)

### Step 2: Choose Your Script
Your friend can use either **PowerShell** or **Python**:

#### Option A: PowerShell (Windows)
1. Save the `friend_pc_script.ps1` file on your PC
2. Edit the file and replace `YOUR_IP_ADDRESS` with the actual IP
3. Change `pc-friend-1` to a unique PC ID (e.g., `pc-john-laptop`)
4. Run in PowerShell:
   ```powershell
   .\friend_pc_script.ps1
   ```

#### Option B: Python (Windows/Mac/Linux)
1. Install Python if not already installed
2. Install required packages:
   ```bash
   pip install requests psutil
   ```
3. Save the `friend_pc_script.py` file on your PC
4. Edit the file and replace `YOUR_IP_ADDRESS` with the actual IP
5. Change `pc-friend-1` to a unique PC ID
6. Run:
   ```bash
   python friend_pc_script.py
   ```

### Step 3: Test Connection
- The script will send data every 30 seconds
- You should see messages like: `[14:30:15] Data sent successfully for pc-friend-1`
- If you see errors, check the IP address and make sure the server is running

### Step 4: Verify on Dashboard
- Ask your friend to check their dashboard
- Your PC should appear as "online" with real-time data

## Troubleshooting

### "Connection refused" error
- Make sure your friend's server is running
- Check if the IP address is correct
- If using public IP, make sure port forwarding is set up

### "PC not found" error
- Change the `PC_ID` to something unique
- Ask your friend to add your PC to their database

### Script won't run
- **PowerShell**: Right-click and "Run with PowerShell"
- **Python**: Make sure Python is installed and in PATH

## What Data is Sent
- CPU usage percentage
- RAM usage percentage  
- Disk usage percentage
- Current IP address
- Last reboot time
- Online status

## Security Note
- Only system performance data is sent
- No personal files or information are transmitted
- Data is sent over HTTP (not encrypted)

## Stop Monitoring
Press `Ctrl+C` in the terminal to stop the script.

---

**Need help?** Ask your friend who set up the server! 