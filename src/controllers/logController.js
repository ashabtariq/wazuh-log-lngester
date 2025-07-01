import Log from '../models/Log.js';

export const ingestLog = async (req, res) => {
  try {
    const { source, level, message, metadata, sourceIp } = req.body;

    console.log('📥 Incoming log:', { source, level, message, metadata });

    if (!source || !level || !message) {
      return res.status(400).json({ message: 'source, level, and message are required' });
    }

    const log = await Log.create({ source, level, message, metadata, sourceIp });

    if (['error', 'critical'].includes(level)) {
      console.log(`🔔 Alert: [${level.toUpperCase()}] from ${source} - ${message}`);
    }

    res.status(201).json(log);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { level, source } = req.query;
    const where = {};
    if (level) where.level = level;
    if (source) where.source = source;

    const logs = await Log.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
