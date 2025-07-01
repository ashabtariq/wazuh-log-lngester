import app from './app.js';
import sequelize from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const IP = process.env.SERVER_IP || '0.0.0.0';

sequelize.sync().then(() => {
  console.log('✅ PostgreSQL connected and synced');
  app.listen(PORT,IP, () => {
    console.log(`🚀 Server running on port ${IP}:${PORT}`);
  });
}).catch(err => console.error('❌ DB Connection Error:', err));
