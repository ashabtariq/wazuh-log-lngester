# 🛡️ Wazuh Log Collector API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker Ready](https://img.shields.io/badge/docker-ready-blue.svg)](Dockerfile)

> A lightweight Node.js service to **ingest structured security alerts** (e.g. Wazuh Active Responses) and store them in a PostgreSQL database with optional alerting and secure API key access.

---

## 🚀 Features

- 🔐 API Key-based authentication
- 📥 POST `/logs` to ingest alerts
- 💾 Logs stored in PostgreSQL using Sequelize ORM
- 📂 Optional disk-based log file backup
- 🧠 Easy integration with Wazuh Active Response
- 📡 Lightweight and container-ready

---

## 📦 Tech Stack

- Node.js (ESM)
- Express.js
- PostgreSQL
- Sequelize ORM
- dotenv
- axios, crypto

---

## 🐳 Docker Deployment

```bash
# Clone and build the image
git clone https://github.com/ashabtariq/wazuh-log-lngester.git
cd wazuh-log-collector
docker build -t wazuh-log-collector .

# Run with environment variables
docker run -p 3000:3000   -e DATABASE_URL=postgres://user:pass@host:5432/logsdb   -e API_KEY=your_api_key_here   wazuh-log-collector
```

---

## 🔧 Local Setup

```bash
git clone https://github.com/ashabtariq/wazuh-log-lngester.git
cd wazuh-log-collector
npm install
cp .env.example .env
npm start
```

---

## 🔐 Authentication

All requests to `/logs` require an `x-api-key` header:

```http
POST /logs
x-api-key: your_api_key
Content-Type: application/json
```

---

## 📬 Example Payload

```json
{
  "source": "victimpi",
  "sourceIp": "192.168.1.37",
  "level": "warning",
  "message": "Invalid user attempt",
  "metadata": {
    "rule": { "id": 5710, "description": "SSH brute force" },
    "srcip": "192.168.1.37"
  }
}
```

---

## 🧩 Wazuh Integration (Active Response)

**Wazuh Config (`ossec.conf`):**

```xml
<command>
  <name>forward-log</name>
  <executable>forward-log.sh</executable>
  <timeout_allowed>no</timeout_allowed>
</command>

<active-response>
  <command>forward-log</command>
  <location>local</location>
  <level>5</level>
</active-response>
```

**forward-log.sh Example:**

```bash
#!/bin/bash
ALERT=$(cat)
LEVEL=$(echo "$ALERT" | jq -r '.parameters.alert.rule.level // "info"')
SOURCE=$(echo "$ALERT" | jq -r '.parameters.alert.agent.name')
SRCIP=$(echo "$ALERT" | jq -r '.parameters.alert.data.srcip')
MESSAGE=$(echo "$ALERT" | jq -r '.parameters.alert.rule.description')

curl -X POST http://localhost:3000/logs   -H "Content-Type: application/json"   -H "x-api-key: your_api_key"   -d "{"source":"$SOURCE","sourceIp":"$SRCIP","level":"$LEVEL","message":"$MESSAGE","metadata":$ALERT}"
```

---

## 📁 Project Structure

```
log-collector/
├── server.js
├── models/
├── middleware/
├── config/
├── utils/
├── logs/
├── Dockerfile
├── .env.example
```

---

## 🛠️ Future Improvements

- API key rotation system
- Alert severity email/Slack notification
- Dashboard frontend (React)
- Webhook support

---

## 📄 License

MIT © [Ashab Tariq](https://github.com/ashabtariq)