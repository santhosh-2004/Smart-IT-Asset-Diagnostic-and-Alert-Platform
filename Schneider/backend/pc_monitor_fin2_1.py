import requests
import psutil
import time
import json
from datetime import datetime

# Configuration
SERVER_URL = "http://localhost:3001/api/pc/update"
PC_ID = "pc-fin2-1"

def collect_pc_data():
    return {
        "pcId": PC_ID,
        "data": {
            "cpu": f"{psutil.cpu_percent()}%",
            "ram": f"{psutil.virtual_memory().percent}%",
            "disk": f"{psutil.disk_usage('/').percent}%",
            "status": "online",
            "lastReboot": "2024-01-25T08:30:00Z",
            "ipAddress": "192.168.10.51"
        }
    }

def send_data():
    try:
        data = collect_pc_data()
        response = requests.post(SERVER_URL, json=data)
        if response.status_code == 200:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Data sent successfully for {PC_ID}")
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Error sending data: {response.status_code}")
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Connection error: {e}")

if __name__ == "__main__":
    print(f"Starting PC monitor for {PC_ID}")
    print(f"Sending data to: {SERVER_URL}")
    print("Press Ctrl+C to stop")
    
    # Run every 30 seconds
    while True:
        send_data()
        time.sleep(30) 