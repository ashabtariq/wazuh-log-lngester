import Log from '../models/Log.js';

export const ingestLog = async (req, res) => {
  try {
    const WHITELISTT_RULES = process.env.RULE_IDS.split(',');
    const { source, level, message, metadata, sourceIp } = req.body;

    console.log('📥 Incoming log:', { source, level, message, metadata });

    if (!source || !level || !message) {
      return res.status(400).json({ message: 'source, level, and message are required' });
    }

    //CHECK IF RULE ID MATCHES LIST IN ENV
    if(WHITELISTT_RULES.includes(metadata.rule.id)){
      const log = await Log.create({ source, level, message, metadata, sourceIp });
      res.status(201)
    }
    else{
      console.log(`❌  Rule Discarded: [${level.toUpperCase()}] from ${source} - ${message}`);
      res.status(405) //RULE DISCARD STATUS
    }
    
    
    if (['error', 'critical'].includes(level)) {
      console.log(`🔔 Alert: [${level.toUpperCase()}] from ${source} - ${message}`);
    }

    
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
