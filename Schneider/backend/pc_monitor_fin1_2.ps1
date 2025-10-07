# PowerShell script for Windows PC monitoring
# PC: pc-fin1-2 (Finishing Line 1, PC 2)

$SERVER_URL = "http://localhost:3001/api/pc/update"
$PC_ID = "pc-fin1-2"

Write-Host "Starting PC monitor for $PC_ID"
Write-Host "Sending data to: $SERVER_URL"
Write-Host "Press Ctrl+C to stop"
Write-Host ""

function Send-PCData {
    try {
        # Get system information
        $cpu = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
        $memory = (Get-Counter "\Memory\% Committed Bytes In Use").CounterSamples.CookedValue
        $disk = (Get-Counter "\PhysicalDisk(_Total)\% Disk Time").CounterSamples.CookedValue
        
        # Create data object
        $data = @{
            pcId = $PC_ID
            data = @{
                cpu = "$([math]::Round($cpu, 1))%"
                ram = "$([math]::Round($memory, 1))%"
                disk = "$([math]::Round($disk, 1))%"
                status = "online"
                lastReboot = "2024-01-25T09:00:00Z"
                ipAddress = "192.168.254.90"
            }
        }
        
        # Convert to JSON and send
        $jsonData = $data | ConvertTo-Json -Depth 3
        $response = Invoke-RestMethod -Uri $SERVER_URL -Method POST -Body $jsonData -ContentType "application/json"
        
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] Data sent successfully for $PC_ID"
    }
    catch {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] Error sending data: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main loop - send data every 30 seconds
while ($true) {
    Send-PCData
    Start-Sleep -Seconds 30
} 