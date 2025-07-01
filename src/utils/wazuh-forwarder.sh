#!/bin/bash

LOG_TIME=$(date)
DEBUG_LOG="/tmp/wazuh-debug.log"

read input

echo "[$LOG_TIME] === Forward Log Triggered ===" >> $DEBUG_LOG
echo "$input" >> $DEBUG_LOG

# Extract alert object from input
ALERT_JSON=$(echo "$input" | jq -c '.parameters.alert')

if [ -z "$ALERT_JSON" ] || [ "$ALERT_JSON" == "null" ]; then
  echo "[$LOG_TIME] ❌ No alert found" >> $DEBUG_LOG
  exit 1
fi

# Extract core fields
SOURCE=$(echo "$ALERT_JSON" | jq -r '.agent.name // "unknown-agent"')
SRCIP=$(echo "$ALERT_JSON" | jq -r '.data.srcip // "unknown-ip"')
LEVEL_NUM=$(echo "$ALERT_JSON" | jq -r '.rule.level // 0')
MESSAGE=$(echo "$ALERT_JSON" | jq -r '.rule.description // "No description"')

# Map numeric level to string
if [ "$LEVEL_NUM" -ge 10 ]; then
  LEVEL="critical"
elif [ "$LEVEL_NUM" -ge 7 ]; then
  LEVEL="error"
elif [ "$LEVEL_NUM" -ge 4 ]; then
  LEVEL="warning"
else
  LEVEL="info"
fi

# Prepare metadata block
METADATA=$(echo "$ALERT_JSON" | jq -c '{rule: .rule, location: .location, full_log: .full_log, srcip: .data.srcip, srcuser: .data.srcuser}')

# API endpoint
API_URL="http://192.168.1.37:3000/api/logs"     # Replace this
API_KEY="TEST"                           # Optional, add header if needed

# Send the log to API
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d @- <<EOF
{
  "source": "$SOURCE",
  "sourceIp": "$SRCIP",
  "level": "$LEVEL",
  "message": "$MESSAGE",
  "metadata": $METADATA
}
EOF
)

echo "[$LOG_TIME] ✅ Sent log. Response code: $RESPONSE" >> $DEBUG_LOG
exit 0
