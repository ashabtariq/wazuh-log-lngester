// logCollector.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/logs';
const API_KEY = process.env.API_KEY || 'TEST';

// File paths to monitor (Wazuh, Suricata, etc.)
const logSources = [
  { source: 'wazuh', file: '/var/ossec/logs/alerts/alerts.json' },
  { source: 'suricata', file: '/var/log/suricata/eve.json' }
];

function sendLog({ source, level, message, metadata }) {
  return axios.post(
    `${API_URL}/${source}`,
    { source, level, message, metadata },
    { headers: { 'x-api-key': API_KEY } }
  ).then(() => {
    console.log(`[✓] Sent ${source} log: ${message.slice(0, 50)}...`);
  }).catch(err => {
    console.error(`[✗] Failed to send ${source} log:`, err.message);
  });
}

function parseAndSend(source, line) {
  try {
    const log = JSON.parse(line);

    const level = log.alert?.severity === 1 ? 'critical' :
                  log.alert?.severity === 2 ? 'error' : 'info';

    const message = log.alert?.signature || log.message || 'Unknown event';
    const metadata = log;

    sendLog({ source, level, message, metadata });
  } catch (err) {
    console.warn(`[!] Could not parse log line:`, err.message);
  }
}

function tailFile({ source, file }) {
  if (!fs.existsSync(file)) {
    console.error(`[!] Log file not found: ${file}`);
    return;
  }

  console.log(`[~] Watching ${source} log file: ${file}`);

  const stream = fs.createReadStream(file, { encoding: 'utf8', start: fs.statSync(file).size });

  let buffer = '';

  stream.on('data', chunk => {
    buffer += chunk;
    let lines = buffer.split('\n');
    buffer = lines.pop(); // last partial line
    lines.forEach(line => line.trim() && parseAndSend(source, line));
  });

  stream.on('error', err => {
    console.error(`[!] Stream error:`, err.message);
  });
}

// Start collectors for each source
logSources.forEach(tailFile);
