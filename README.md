A real-time monitoring dashboard developed to track the operational health of in-line PCs across a factory shop floor.
Built as part of an industrial project at Schneider Electric, the system provides centralized visibility into each PC’s performance using a full-stack client–server architecture.
The system continuously monitors key parameters such as CPU usage, memory utilization, uptime, and user sessions for all in-line PCs deployed across the shop floor.
Each PC runs a lightweight Python script that transmits real-time metrics to a Node.js server every 30 seconds. The frontend dashboard, built with React.js and Tailwind CSS, visualizes system health on the factory layout using color-coded indicators (Active, Warning, Critical).

Tech Stack : 

Backend: Python, Node.js, Express.js, SQLite / MongoDB
Frontend: React.js, Tailwind CSS
Communication: RESTful APIs (HTTP)
Architecture: Client–Server (LAN-based)

Features:

Real-time system health monitoring (CPU, RAM, uptime)
Visual layout of the F&F section for quick fault localization
Role-based access: Viewer Mode and Admin Mode
Admin authentication with editable PC configuration
Reboot interval tracking and alerting
Scalable design for plant-wide deployment

System Workflow

Python client runs on each in-line PC → collects and sends metrics via HTTP.
Node.js backend processes incoming data and stores it in a database.
React dashboard fetches data via APIs and visualizes PC statuses in real time.

