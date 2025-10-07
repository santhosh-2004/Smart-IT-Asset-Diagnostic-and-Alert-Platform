# Python script for your friend's PC to connect to your monitoring system
# Replace YOUR_IP_ADDRESS with your actual IP address

import requests
import psutil
import time
import json
from datetime import datetime

# IMPORTANT: Replace this with your actual IP address
SERVER_URL = "http://YOUR_IP_ADDRESS:3001/api/pc/update"

# Your friend should set their PC ID (choose one that's not already used)
PC_ID = "pc-friend-1"  # Change this to a unique ID

print(f"Starting PC monitor for {PC_ID}")
print(f"Sending data to: {SERVER_URL}")
print("Press Ctrl+C to stop")
print()

def send_pc_data():
    try:
        # Get system information
        cpu_percent = psutil.cpu_percent(interval=1)
        memory_percent = psutil.virtual_memory().percent
        disk_percent = psutil.disk_usage('/').percent
        
        # Get IP address
        ip_address = None
        for interface, addresses in psutil.net_if_addrs().items():
            for addr in addresses:
                if addr.family == psutil.AF_INET and not addr.address.startswith('127.'):
                    ip_address = addr.address
                    break
            if ip_address:
                break
        
        # Get last boot time
        boot_time = datetime.fromtimestamp(psutil.boot_time()).isoformat() + "Z"
        
        # Create data object
        data = {
            "pcId": PC_ID,
            "data": {
                "cpu": f"{cpu_percent:.1f}%",
                "ram": f"{memory_percent:.1f}%",
                "disk": f"{disk_percent:.1f}%",
                "status": "online",
                "lastReboot": boot_time,
                "ipAddress": ip_address or "unknown"
            }
        }
        
        # Send data
        response = requests.post(SERVER_URL, json=data, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] Data sent successfully for {PC_ID}")
        
    except Exception as e:
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] Error sending data: {str(e)}")

# Main loop - send data every 30 seconds
try:
    while True:
        send_pc_data()
        time.sleep(30)
except KeyboardInterrupt:
    print("\nStopping PC monitor...") 