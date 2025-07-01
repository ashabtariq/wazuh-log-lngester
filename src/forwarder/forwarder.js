// logForwarder.js
import fs from "fs";
import axios from "axios";

const API_URL = "http://localhost:3000/api/logs";
const API_KEY = "your_secure_api_key";

const lines = fs.readFileSync("/var/log/syslog", "utf-8").split("\n");

for (const line of lines) {
  if (line.trim()) {
    await axios
      .post(
        API_URL,
        {
          source: "syslog",
          level: "info",
          message: line,
        },
        {
          headers: { "x-api-key": API_KEY },
        }
      )
      .catch((err) => console.error("Failed to send log:", err.message));
  }
}
