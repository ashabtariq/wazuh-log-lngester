import crypto from 'crypto';

const apiKey = crypto.randomBytes(32).toString('hex');
console.log('🔑 Your static API key:', apiKey);
