#!/usr/bin/env node

import readline from 'readline';
import axios from 'axios';

const API_URL = 'http://192.168.1.36:3000/api/logs'; // 🔁 Replace with actual URL
const API_KEY = 'TEST'; // Optional

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let inputData = '';

rl.on('line', (line) => {
  inputData += line;
});

rl.on('close', async () => {
  const logTime = new Date().toISOString();
  const logPrefix = `[${logTime}]`;

  try {
    console.log(`${logPrefix} 📨 Input received`);

    const parsed = JSON.parse(inputData);
    const alert = parsed.parameters?.alert;

    if (!alert) {
      console.error(`${logPrefix} ❌ No alert found in payload`);
      process.exit(1);
    }

    const source = alert.agent?.name || 'unknown-agent';
    const srcip = alert.data?.srcip || 'unknown-ip';
    const message = alert.rule?.description || 'No description';
    const levelNum = alert.rule?.level || 0;

    // Map numeric level to string
    let level = 'info';
    if (levelNum >= 10) level = 'critical';
    else if (levelNum >= 7) level = 'error';
    else if (levelNum >= 4) level = 'warning';

    const metadata = {
      rule: alert.rule,
      location: alert.location,
      full_log: alert.full_log,
      srcip: alert.data?.srcip,
      srcuser: alert.data?.srcuser,
    };

    const payload = {
      source,
      sourceIp: srcip,
      level,
      message,
      metadata,
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      timeout: 5000,
    });

    console.log(`${logPrefix} ✅ Sent log. Response code: ${response.status}`);
  } catch (err) {
    console.error(`${logPrefix} ❌ Error sending log:`, err.message);
    process.exit(1);
  }
});
