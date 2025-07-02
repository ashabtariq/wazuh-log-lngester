import crypto from 'crypto';


const genAPIkey = async(req,res)=>{
    const apiKey = crypto.randomBytes(32).toString('hex');
    res.status(200).json({API_KEY: apiKey})
    console.log('🔑 Your static API key:', apiKey);

}
export default genAPIkey;